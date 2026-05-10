function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal, .card, .hero-actions .btn');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach((el, idx) => {
    el.style.transitionDelay = `${Math.min(idx * 40, 280)}ms`;
    observer.observe(el);
  });
}

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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      const msg = result?.errors ? Object.values(result.errors).join(' ') : 'Order failed.';
      status.textContent = msg;
      status.className = 'status error';
      return;
    }
    form.reset();
    status.textContent = result.message || 'Order placed.';
    status.className = 'status success';
  } catch (e) {
    status.textContent = 'Network error. Please try again.';
    status.className = 'status error';
  }
}

document.addEventListener('DOMContentLoaded', initRevealAnimations);
