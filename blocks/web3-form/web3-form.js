/**
 * Web3 Form block - contact forms powered by the splitforms API.
 *
 * Content structure:
 *   Row 1 (optional): Header cell (h2 + description paragraph)
 *   Config rows: Label | Value  (Access Key, Subject, Success Message, From Name)
 *   Field rows: Label | Type     (text, email, tel, textarea, checkbox, submit)
 */

const API_URL = 'https://splitforms.com/api/submit';

const CONFIG_LABELS = new Set([
  'access key',
  'subject',
  'success message',
  'from name',
]);

function fieldName(label) {
  return label.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

function isHeaderRow(row) {
  const cells = row.querySelectorAll(':scope > div');
  if (cells.length === 0) return false;
  return Boolean(cells[0].querySelector('h2, h3'));
}

function readConfig(rows) {
  const config = {
    accessKey: '',
    subject: '',
    successMessage: 'Success! Your message has been sent.',
    fromName: '',
  };
  const fieldRows = [];
  let headerRow = null;

  rows.forEach((row) => {
    if (isHeaderRow(row)) {
      headerRow = row;
      return;
    }

    const cells = row.querySelectorAll(':scope > div');
    if (cells.length < 2) return;

    const label = cells[0].textContent.trim();
    const value = cells[1].textContent.trim();
    const key = label.toLowerCase();

    if (key === 'access key') config.accessKey = value;
    else if (key === 'subject') config.subject = value;
    else if (key === 'success message') config.successMessage = value;
    else if (key === 'from name') config.fromName = value;
    else if (!CONFIG_LABELS.has(key)) {
      fieldRows.push({ label, type: value.toLowerCase() });
    }
  });

  return { config, fieldRows, headerRow };
}

function createHeader(headerRow) {
  const header = document.createElement('div');
  header.className = 'web3-form-header';
  const cell = headerRow.querySelector(':scope > div');
  if (!cell) return header;

  const heading = cell.querySelector('h2, h3');
  const description = cell.querySelector('p');
  if (heading) header.append(heading.cloneNode(true));
  if (description) header.append(description.cloneNode(true));
  return header;
}

function createTextField({ label, type }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'web3-form-field';

  const id = `web3-form-${fieldName(label)}`;
  const lbl = document.createElement('label');
  lbl.htmlFor = id;
  lbl.textContent = label;

  let input;
  if (type === 'textarea') {
    input = document.createElement('textarea');
    input.rows = 5;
  } else {
    input = document.createElement('input');
    input.type = type === 'tel' ? 'tel' : type;
  }

  input.id = id;
  input.name = fieldName(label);
  input.required = type === 'email' || type === 'textarea';

  wrapper.append(lbl, input);
  return wrapper;
}

function createCheckboxField({ label }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'web3-form-consent';

  const id = `web3-form-${fieldName(label)}`;
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.name = fieldName(label);
  input.id = id;

  const lbl = document.createElement('label');
  lbl.htmlFor = id;
  lbl.textContent = label;

  wrapper.append(input, lbl);
  return wrapper;
}

function createSubmitField({ label }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'web3-form-submit';

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = label;

  wrapper.append(btn);
  return wrapper;
}

function createStatus(message, type) {
  const status = document.createElement('p');
  status.className = `web3-form-status web3-form-status-${type}`;
  status.setAttribute('role', type === 'error' ? 'alert' : 'status');
  status.textContent = message;
  return status;
}

async function handleSubmit(event, form, config) {
  event.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  form.querySelector('.web3-form-status')?.remove();

  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  const formData = new FormData(form);
  formData.append('access_key', config.accessKey);
  if (config.subject) formData.append('subject', config.subject);
  if (config.fromName) formData.append('from_name', config.fromName);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });
    const data = await response.json();

    if (response.ok && data.success) {
      form.reset();
      form.prepend(createStatus(config.successMessage, 'success'));
    } else {
      form.prepend(createStatus(data.message || 'Submission failed. Please try again.', 'error'));
    }
  } catch {
    form.prepend(createStatus('Something went wrong. Please try again.', 'error'));
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const { config, fieldRows, headerRow } = readConfig(rows);
  if (!config.accessKey || fieldRows.length === 0) return;

  block.textContent = '';

  if (headerRow) {
    block.append(createHeader(headerRow));
  }

  const form = document.createElement('form');
  form.className = 'web3-form-fields';
  form.noValidate = true;

  const honeypot = document.createElement('input');
  honeypot.type = 'checkbox';
  honeypot.name = 'botcheck';
  honeypot.tabIndex = -1;
  honeypot.autocomplete = 'off';
  honeypot.className = 'web3-form-honeypot';
  honeypot.setAttribute('aria-hidden', 'true');
  form.append(honeypot);

  fieldRows.forEach((field) => {
    if (field.type === 'submit') {
      form.append(createSubmitField(field));
    } else if (field.type === 'checkbox') {
      form.append(createCheckboxField(field));
    } else {
      form.append(createTextField(field));
    }
  });

  form.addEventListener('submit', (event) => handleSubmit(event, form, config));
  block.append(form);
}
