// Initializing Socket.io
const socket = io();

console.log('hello shashi');

// Check if the browser supports geolocation
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            // Get the coordinates
            const { latitude, longitude } = position.coords;
            // Emit an event from frontend
            socket.emit('send-location', { latitude, longitude });  //sending location to frontend
            socket.on('disconnect',function(){
                    io.emit('User-Disconnected')
            })
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true, // Ensure high accuracy
            timeout: 5000,            // Time after which it will refresh and give location again
            maximumAge: 0             // Get fresh data, not cached data
        }
    );
}

// Initialize the map and set the original view
const map = L.map('map').setView([0, 0], 10); // Latitude and longitude both are 0, 10 indicates the zoom level

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize a markers object to keep track of markers by user ID
const markers = {};

// Listen for the 'receive-location' event from the server
socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);           // Set the view of the map to the new coordinates
    if (markers[id]) {                               // Check if a marker already exists for this ID
        markers[id].setLatLng([latitude, longitude]);  // If the marker exists, update its position
    } else {                                          // If the marker doesn't exist, create a new one
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on('User-Disconnected',(id)=>{
   if(markers[id]){
    map.removeLayer(markers[id]),       // if we get offline marker should delete 
    delete markers[id]
   }
})

