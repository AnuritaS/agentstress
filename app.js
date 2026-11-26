const policy = document.querySelector('#policy');
const rows = Array.from(document.querySelectorAll('tbody tr'));
policy.addEventListener('change', () => {
  let visible = 0;
  for (const row of rows) {
    row.hidden = policy.value !== 'all' && row.dataset.policy !== policy.value;
    if (!row.hidden) visible++;
  }
  document.querySelector('#count').textContent = `Showing ${visible} of ${rows.length} responses`;
});
