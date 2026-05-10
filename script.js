async function submitOrder(event) {
  event.preventDefault();
  const form = event.target;
  const status = document.getElementById("order-status");
  const payload = {
    customer: form.customer.value.trim(),
    phone: form.phone.value.trim(),
    city: form.city.value.trim(),
    items: form.items.value.trim(),
    payment_method: form.payment_method.value,
  };

  status.textContent = "Submitting order...";

  try {
    const response = await fetch('/api/order', {
async function submitContact(event) {
  event.preventDefault();

  const form = event.target;
  const status = document.getElementById("form-status");
  const payload = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    message: form.message.value.trim(),
  };

  status.textContent = "Sending...";

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      const msg = result?.errors ? Object.values(result.errors).join(' ') : 'Order failed.';

    const result = await response.json();
    if (!response.ok) {
      const msg = result?.errors ? Object.values(result.errors).join(' ') : 'Could not submit form.';
      status.textContent = msg;
      status.className = 'status error';
      return;
    }
    form.reset();
    status.textContent = result.message || 'Order placed.';
    status.className = 'status success';
  } catch (e) {

    form.reset();
    status.textContent = result.message || 'Message sent.';
    status.className = 'status success';
  } catch (error) {
    status.textContent = 'Network error. Please try again.';
    status.className = 'status error';
  }
}
