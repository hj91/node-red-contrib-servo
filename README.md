
# node-red-contrib-servo

`node-red-contrib-servo` is a Node-RED node designed to control servo motors by stepping from one position to another. It receives values via topics for `from`, `to`, and `duration` to control the motor's movement. This node handles the precise positioning of servo motors and includes error handling to ensure the input values are valid.

## Features

- **Configurable via Topics**: Specify the `from`, `to`, and `duration` parameters dynamically using MQTT or inject nodes.
- **Start/Stop/Resume Functionality**: Control the motor's movement using commands like `start`, `stop`, and `resume`.
- **Error Handling**: Ensures that the `from`, `to`, and `duration` parameters are valid numbers before initiating motor movement.
- **Accurate Movement**: Avoids unnecessary resets of the servo motor to its home position after stepping, maintaining its accuracy.

## Installation

Install via the Node-RED palette manager or run the following command in your Node-RED user directory (typically `~/.node-red`):

```bash
npm install node-red-contrib-servo
```

## Usage

1. **Send Control Messages**: 
   - Use `start`, `stop`, and `resume` commands to control the servo motor.
   - Send these commands with a `true` payload via MQTT or inject nodes.

2. **Set Movement Parameters**:
   - Send numeric payloads for `from`, `to`, and `duration` to set the servo's stepping range and speed.

### Example Flow

Here’s a simple example flow to control the servo motor:

```json
[{"id":"inject_start","type":"inject","z":"flow_id","name":"Start","props":[{"p":"payload","v":"true","vt":"bool"},{"p":"topic","v":"start","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"start","payload":"true","payloadType":"bool"},{"id":"inject_stop","type":"inject","z":"flow_id","name":"Stop","props":[{"p":"payload","v":"true","vt":"bool"},{"p":"topic","v":"stop","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"stop","payload":"true","payloadType":"bool"},{"id":"servo_node","type":"servo","z":"flow_id","name":"Servo Controller","from":"","to":"","duration":"","x":400,"y":200,"wires":[[]]}]
```

In this flow:
- Use an `inject` node to send the `start`, `stop`, and `resume` commands.
- Use another `inject` node to send numeric payloads for `from`, `to`, and `duration` to control the servo motor.

### Topics

- **start**: Starts stepping the servo motor from the `from` position to the `to` position within the defined `duration`.
- **stop**: Pauses the stepping.
- **resume**: Resumes the stepping from where it was paused.
- **from**: Defines the starting position for the servo (numeric payload).
- **to**: Defines the target position for the servo (numeric payload).
- **duration**: Defines the time (in milliseconds) it takes for each step (numeric payload).

### Error Handling

The node will check the input parameters for validity:
- `from`, `to`, and `duration` must all be valid numbers.
- If an invalid value is received, an error message will be displayed in the debug panel.

### Node Status

- **Blue Dot**: Ready to receive commands.
- **Blue Ring**: Stepping in progress.
- **Red Ring**: Stepping paused.
- **Green Dot**: Stepping completed.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](https://www.gnu.org/licenses/gpl-3.0.html) file for details.

