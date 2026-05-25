"""
Quick-start script to push all migrated content to the specific Google Doc.

Target Doc: https://docs.google.com/document/d/1_X9dB-zwPAEun3-2-nkEqsMJsuC-qFN0E2MtFTaJlu4/edit

Usage:
  1. Place credentials.json in this directory
  2. pip install -r requirements.txt
  3. python tools/gdocs-push/push-to-target-doc.py
"""

import os
import sys

# Add parent to path for imports
sys.path.insert(0, os.path.dirname(__file__))

from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Your target document
DOCUMENT_ID = "1_X9dB-zwPAEun3-2-nkEqsMJsuC-qFN0E2MtFTaJlu4"

SCOPES = [
    "https://www.googleapis.com/auth/documents",
]

TOKEN_PATH = os.path.join(os.path.dirname(__file__), "token.json")
CREDS_PATH = os.path.join(os.path.dirname(__file__), "credentials.json")


def get_credentials():
    creds = None
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDS_PATH):
                print(f"ERROR: {CREDS_PATH} not found.")
                print("Download OAuth credentials from Google Cloud Console.")
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(CREDS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_PATH, "w") as token:
            token.write(creds.to_json())
    return creds


def clear_doc(service, doc_id):
    """Clear all content from the document."""
    doc = service.documents().get(documentId=doc_id).execute()
    body_content = doc.get("body", {}).get("content", [])
    if len(body_content) > 1:
        end_index = body_content[-1].get("endIndex", 1) - 1
        if end_index > 1:
            service.documents().batchUpdate(
                documentId=doc_id,
                body={"requests": [{"deleteContentRange": {"range": {"startIndex": 1, "endIndex": end_index}}}]}
            ).execute()


def insert_block_table(requests, index, block_name, rows):
    """
    Insert an EDS block as a Google Docs table.

    EDS block table format:
    +------------------+
    | Block Name       |  <- Header row (merged, bold)
    +--------+---------+
    | cell1  | cell2   |  <- Content rows
    +--------+---------+
    """
    num_cols = max(len(row) for row in rows) if rows else 1
    num_rows = len(rows) + 1  # +1 for the block name header row

    # Insert table
    requests.append({
        "insertTable": {
            "rows": num_rows,
            "columns": max(num_cols, 1),
            "location": {"index": index}
        }
    })
    return requests


def build_requests_from_html(html_content):
    """
    Build Google Docs API requests from .plain.html content.

    Strategy: Use insertText for content with proper formatting.
    Tables are represented as clearly delimited sections that
    map to EDS block authoring patterns.
    """
    from bs4 import BeautifulSoup, NavigableString

    soup = BeautifulSoup(html_content, "html.parser")
    requests = []
    idx = 1

    def add_text(text, bold=False, heading=None, link=None):
        nonlocal idx
        if not text:
            return
        text_with_nl = text + "\n"
        requests.append({"insertText": {"location": {"index": idx}, "text": text_with_nl}})

        text_range = {"startIndex": idx, "endIndex": idx + len(text)}

        if bold:
            requests.append({
                "updateTextStyle": {
                    "range": text_range,
                    "textStyle": {"bold": True},
                    "fields": "bold"
                }
            })
        if link:
            requests.append({
                "updateTextStyle": {
                    "range": text_range,
                    "textStyle": {"link": {"url": link}},
                    "fields": "link"
                }
            })
        if heading:
            requests.append({
                "updateParagraphStyle": {
                    "range": {"startIndex": idx, "endIndex": idx + len(text) + 1},
                    "paragraphStyle": {"namedStyleType": f"HEADING_{heading}"},
                    "fields": "namedStyleType"
                }
            })

        idx += len(text_with_nl)

    def add_separator():
        nonlocal idx
        add_text("---")

    def format_block_name(class_name):
        parts = class_name.split("-", 1)
        if len(parts) == 2:
            return f"{parts[0].title()} ({parts[1]})"
        return class_name.replace("-", " ").title()

    def process_cell(cell_div):
        """Process a table cell div and output its content."""
        for child in cell_div.children:
            if isinstance(child, NavigableString):
                text = str(child).strip()
                if text:
                    add_text(text)
            elif child.name == "picture":
                img = child.find("img")
                if img and img.get("src"):
                    add_text(f"🖼 {img.get('alt', 'image')}", link=img["src"])
            elif child.name == "img":
                if child.get("src"):
                    add_text(f"🖼 {child.get('alt', 'image')}", link=child["src"])
            elif child.name in ("h1", "h2", "h3", "h4", "h5", "h6"):
                add_text(child.get_text(), heading=int(child.name[1]))
            elif child.name == "p":
                a_tag = child.find("a")
                if a_tag and a_tag.get_text().strip() == child.get_text().strip():
                    add_text(a_tag.get_text(), link=a_tag.get("href"))
                else:
                    add_text(child.get_text())
            elif child.name == "a":
                add_text(child.get_text(), link=child.get("href"))
            elif child.name == "ul":
                for li in child.find_all("li"):
                    add_text(f"  • {li.get_text()}")
            elif child.name == "ol":
                for i, li in enumerate(child.find_all("li"), 1):
                    add_text(f"  {i}. {li.get_text()}")
            else:
                text = child.get_text().strip()
                if text:
                    add_text(text)

    # Walk through top-level elements
    body = soup.find("body") or soup
    top_nodes = body.find_all(recursive=False) if body != soup else soup.find_all(recursive=False)

    for node in top_nodes:
        if node.name == "hr":
            add_separator()
        elif node.name == "div":
            # Check if this wraps a block
            block_div = node.find("div", recursive=False)
            if block_div and block_div.get("class"):
                class_name = " ".join(block_div.get("class"))
                block_display = format_block_name(class_name)

                # Block header
                add_text(f"┌{'─' * 60}┐")
                add_text(f"│ {block_display}", bold=True)
                add_text(f"├{'─' * 60}┤")

                # Block rows
                row_divs = block_div.find_all("div", recursive=False)
                for row_div in row_divs:
                    cell_divs = row_div.find_all("div", recursive=False)
                    if cell_divs:
                        for ci, cell_div in enumerate(cell_divs):
                            if ci > 0:
                                add_text("  │  ")
                            process_cell(cell_div)
                    else:
                        process_cell(row_div)
                    add_text(f"├{'─' * 60}┤")

                add_text(f"└{'─' * 60}┘")
                add_text("")
            else:
                # Default content div
                for child in node.children:
                    if hasattr(child, "name") and child.name:
                        if child.name in ("h1", "h2", "h3", "h4", "h5", "h6"):
                            add_text(child.get_text(), heading=int(child.name[1]))
                        elif child.name == "p":
                            add_text(child.get_text())
                        elif child.name == "a":
                            add_text(child.get_text(), link=child.get("href"))
                        else:
                            text = child.get_text().strip()
                            if text:
                                add_text(text)
        else:
            if hasattr(node, "get_text"):
                text = node.get_text().strip()
                if text:
                    add_text(text)

    return requests


def main():
    print("=" * 60)
    print("EDS Content → Google Docs Push")
    print(f"Target: https://docs.google.com/document/d/{DOCUMENT_ID}/edit")
    print("=" * 60)

    # Find content files
    project_root = Path(__file__).parent.parent.parent
    content_dir = project_root / "content"

    html_files = list(content_dir.rglob("*.plain.html"))
    if not html_files:
        print(f"\nNo .plain.html files found in {content_dir}")
        sys.exit(1)

    print(f"\nFound {len(html_files)} file(s):")
    for f in html_files:
        print(f"  • {f.relative_to(project_root)}")

    # Authenticate
    print("\nAuthenticating with Google...")
    creds = get_credentials()
    docs_service = build("docs", "v1", credentials=creds)

    # Clear existing doc content
    print("Clearing existing document content...")
    clear_doc(docs_service, DOCUMENT_ID)

    # Combine all content files
    combined_html = ""
    for html_file in html_files:
        if combined_html:
            combined_html += "\n<hr>\n"
        combined_html += html_file.read_text(encoding="utf-8")

    # Build and execute requests
    print("Building document content...")
    api_requests = build_requests_from_html(combined_html)

    if api_requests:
        print(f"Pushing {len(api_requests)} operations to Google Doc...")
        # Batch in chunks of 100 to avoid API limits
        chunk_size = 100
        for i in range(0, len(api_requests), chunk_size):
            chunk = api_requests[i:i + chunk_size]
            docs_service.documents().batchUpdate(
                documentId=DOCUMENT_ID,
                body={"requests": chunk}
            ).execute()
            print(f"  Sent batch {i // chunk_size + 1}/{(len(api_requests) + chunk_size - 1) // chunk_size}")

    print(f"\n✅ Done! Content pushed to Google Doc.")
    print(f"   View: https://docs.google.com/document/d/{DOCUMENT_ID}/edit")
    print(f"\nNext steps:")
    print(f"  1. Review the doc - blocks appear as bordered text sections")
    print(f"  2. Convert text block representations to actual Word/Docs tables")
    print(f"  3. Connect to AEM via fstab.yaml and preview")


if __name__ == "__main__":
    main()
