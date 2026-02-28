import fetch from 'node-fetch';

const formData = new FormData();
formData.append("title", "Test Rifa");
formData.append("description", "Desc");
formData.append("totalNumbers", "100");
formData.append("numberPrice", "10");
formData.append("category", "SORTEIO");
formData.append("theme", "DEFAULT");
formData.append("balloonShape", "ROUNDED");

fetch("http://localhost:3000/dashboard/rifas/nova", {
  method: "POST", // Actually this is a Server Action, we can't easily curl it like this.
})
