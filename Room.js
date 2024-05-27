import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const ROOM_SIZE = 500;

function Room() {
	const [players, setPlayers] = useState({});
	const [playerId, setPlayerId] = useState(null);

	useEffect(() => {
		// handle socket events Here
		
		
		socket.on("playerDisconnected", (id) => {
			// socket action here
		});

		return () => {
			socket.off("currentPlayers");
			socket.off("newPlayer");
			socket.off("playerMoved");
			socket.off("playerDisconnected");
		};
	}, []);

	useEffect(() => {
		setPlayerId(socket.id);

		const handleKeyDown = (e) => {
			switch (e.key) {
				case "ArrowLeft":
					// socket action here
					break;
				case "ArrowRight":
					// socket action here
					break;
				case "ArrowUp":
					// socket action here
					break;
				case "ArrowDown":
					// socket action here
					break;
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div
			style={{
				position: "relative",
				width: ROOM_SIZE,
				height: ROOM_SIZE,
				border: "2px solid black",
			}}
		>
			{Object.keys(players).map((id) => {
				const player = players[id];
				return (
					<div
						key={id}
						style={{
							position: "absolute",
							width: 20,
							height: 20,
							backgroundColor: player.color,
							left: player.x,
							top: player.y,
							transform: "translate(-50%, -50%)",
						}}
					></div>
				);
			})}
		</div>
	);
}

export default Room;
