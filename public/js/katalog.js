function setParams() {
  const url = new URL(window.location.href);
  if (minprice !== undefined && minprice !== '') url.searchParams.set('minprice', minprice.value);
  if (maxprice !== undefined && maxprice !== '') url.searchParams.set('maxprice', maxprice.value);


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