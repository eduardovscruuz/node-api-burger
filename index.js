const { request, response } = require("express");
const express = require("express");

const app = express();
const uuid = require("uuid");
const port = 3000;
app.use(express.json());

const pedidos = [];

// ROTA DE -->> MIDDLEWARES <<--

const checkClientId = (request, response, next) => {
	const { id } = request.params;
	const index = pedidos.findIndex((pedido) => pedido.id === id);

	if (index < 0) {
		return response.status(404).json({ message: "Client not found" });
	}

	request.pedidoIndex = index;
	request.pedidoId = id;

	next();
};

//ROTA DE -->> POST <<-- PARA CRIAR

app.post("/orders", (request, response) => {
	const { order, clientName, status } = request.body;
	const pedido = { id: uuid.v4(), order, clientName, status };
	pedidos.push(pedido);
	return response.status(201).json(pedido);
});

//ROTA DE -->> PUT <<-- PRA ATUALIZAR

app.put("/orders/:id", checkClientId, (request, response) => {
	const { order, clientName, status } = request.body;
	const index = request.pedidoIndex;
	const id = request.pedidoId;

	const pedidoAtualizado = { id, order, clientName, status };

	pedidos[index] = pedidoAtualizado;

	return response.json(pedidoAtualizado);
});

//ROTA DE -->> GET <<-- PARA PEGAR INFORMAÇÕES

app.get("/orders", (request, response) => {
	return response.json(pedidos);
});

//ROTA DE -->> DELETE <<-- PARA DELETAR USER

app.delete("/orders/:id", checkClientId, (request, response) => {
	const index = request.pedidoIndex;

	pedidos.splice(index, 1);

	return response.status(204).json();
});

// LISTEN APP

app.listen(3000, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
