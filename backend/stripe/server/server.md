# Server is used in the Glitch platform

Link live code: https://chemical-olive-floor.glitch.me
Link Code: https://glitch.com/edit/#!/chemical-olive-floor

To use another platform was decided because the compatibility and accessibility needs were critical for testing with
both iOS and Android devices.
Using a localhost setup often poses challenges when connecting from physical mobile devices,
as they do not recognize 'localhost' as the server running on your machine.
To ensure that the server is
accessible from the devices where the React Native app is running, deploying the server on a platform like Glitch
provides a universally accessible URL, bypassing the limitations of a local network.
Additionally, while configuring
CORS (Cross-Origin Resource Sharing) is feasible for enabling cross-origin requests on a local server, using an online
development environment like Glitch simplifies the setup.
This also ensures immediate compatibility across different
testing environments without the need for additional network configuration.