function setParams() {

  const find = document.getElementById('find');
  const minprice = document.getElementById('minprice'); // если есть
  const maxprice = document.getElementById('maxprice');

  const url = new URL(window.location.href);
  
  if (minprice !== undefined && minprice !== '') url.searchParams.set('minprice', minprice.value);
  if (maxprice !== undefined && maxprice !== '') url.searchParams.set('maxprice', maxprice.value);
  if (find !== undefined && find !== '') url.searchParams.set('find', find.value);

  window.location.href = url.toString();
}

function ascending() {
  const url = new URL(window.location.href);
  url.searchParams.set('sort', 'ascending');
  window.location.href = url.toString();
}

function descending() {
  const url = new URL(window.location.href);
  url.searchParams.set('sort', 'descending');
  window.location.href = url.toString();
}

function resetFilters() {
  history.replaceState(null, '', window.location.pathname);
  location.reload();
}