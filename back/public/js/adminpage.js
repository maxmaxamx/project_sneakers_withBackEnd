async function ready(username) {
    try {
        const response = await fetch(`/admin/delete/${username}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Не удалось удалить товар');
        }

        const result = await response.json();

        location.reload();

    } catch (error) {
        console.error('Ошибка удаления:', error);
        alert("Ошибка: " + error.message);
    }
}
