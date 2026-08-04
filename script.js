  async function fetchData() {
    try {
        const res = await fetch('/fetch');
        const data = await res.text();
        document.getElementById('result').textContent = data;
        document.getElementById('result').style.display = 'block';
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}  