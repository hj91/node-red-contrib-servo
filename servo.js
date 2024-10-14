/**
 * servo.js - Copyright 2023 Harshad Joshi and Bufferstack.IO Analytics Technology LLP, Pune
 * Licensed under the GNU General Public License, Version 3.0 (the "License");
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * https://www.gnu.org/licenses/gpl-3.0.html
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 **/

module.exports = function(RED) {
    function ServoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.currentValue = 0;
        var intervalId = null;
        var isPaused = false;
        var pausedValue = null;
        var from = null;
        var to = null;
        var duration = null;
        
        function startStepping() {
            if (intervalId !== null) {
                clearInterval(intervalId); // Ensure no intervals are already running
            }
            if (isPaused && pausedValue !== null) {
                node.currentValue = pausedValue;
                isPaused = false;
            }
            intervalId = setInterval(function() {
                if ((from < to && node.currentValue >= to) ||
                    (from > to && node.currentValue <= to)) {
                    clearInterval(intervalId);
                    intervalId = null;
                    node.send({payload: node.currentValue});
                    node.status({fill:"green", shape:"dot", text:"Stepping completed"});
                    return;
                }
                node.send({payload: node.currentValue});
                node.status({fill:"blue", shape:"dot", text:"Stepping..."});
                node.currentValue += (from < to) ? 1 : -1;
            }, duration);
        }

        function stopStepping() {
            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
                pausedValue = node.currentValue;
                isPaused = true;
                node.status({fill:"red", shape:"ring", text:"Stepping paused"});
            }
        }

        function resetStepping() {
            stopStepping(); // Stop any existing stepping process
            node.currentValue = from; // Reset the current value
            node.send({payload: node.currentValue, topic: "reset"});
            node.status({}); // Clear status ideally should be orange 
        }

        function validateNumber(input, fieldName) {
            if (isNaN(input)) {
                node.error(fieldName + " must be a number");
                return false;
            }
            return true;
        }

        node.on('input', function(msg) {
            if (typeof msg.payload === "boolean" && msg.payload === true) {
                switch (msg.topic) {
                    case "start":
                        if (validateNumber(from, "from") && validateNumber(to, "to") && validateNumber(duration, "duration")) {
                            startStepping();
                        }
                        break;
                    case "stop":
                        stopStepping();
                        break;
                    case "reset":
                        resetStepping();
                        break;
                    case "resume":
                        startStepping(); // Resume stepping
                        break;
                    default:
                        node.warn("Received unknown topic or incorrect payload. Expected topics: start, stop, reset, resume.");
                        break;
                }
            } else if (typeof msg.payload === "number") {
                switch (msg.topic) {
                    case "from":
                        from = msg.payload;
                        break;
                    case "to":
                        to = msg.payload;
                        break;
                    case "duration":
                        duration = msg.payload;
                        break;
                    default:
                        node.warn("Received unknown topic. Expected topics: from, to, duration.");
                        break;
                }
            } else {
                node.warn("Ignoring input: payload must be boolean true or a number.");
            }
        });

        node.on('close', function() {
            stopStepping(); // Clear interval on node redeployment or shutdown
        });

        // Initial status
        node.status({fill:"blue", shape:"dot", text:"Ready"});
    }
    RED.nodes.registerType("servo", ServoNode);
}

