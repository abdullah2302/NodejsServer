  async function fetchData() {
    try {
        const res = await fetch('/fetch');
        const data = await res.text();
        console.log(data);
        document.getElementById('result').textContent = data;
        document.getElementById('result').style.display = 'block';
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}  