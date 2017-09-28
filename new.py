from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

class SimpleEcho(WebSocket):
	def handleMessage(self):
		self.sendMessage(self.data)

	def handleConnected(self):
		print(self.address, 'connected')
	def handleClose(self):
		print(self.address, 'closed')

server = SimpleWebSocketServer('',3000,SimpleEcho)
server.serveforever()
