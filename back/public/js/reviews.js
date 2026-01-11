function setParams() {

    const find = document.getElementById('find');

    const url = new URL(window.location.href);

    if (find !== undefined && find !== '') url.searchParams.set('find', find.value);

    window.location.href = url.toString();
}

