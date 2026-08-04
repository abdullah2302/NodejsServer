  async function fetchData() {
    try {
        const res = await fetch('/fetch');
        const data = await res.text();
        document.getElementById('result').textContent = data;
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}  