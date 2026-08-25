# Start the Networth Mobile App

## 1. Start the backend

Open a WSL terminal and run:

```bash
cd /home/matt/networth-app/backend
nvm use 24
npm run dev
```

Leave this terminal open. Wait for:

```text
Connected to PostgreSQL
Server running at http://0.0.0.0:5000
```

## 2. Start Expo

Open a second WSL terminal and run:

```bash
cd /home/matt/networth-app/mobile-app
nvm use 24
npx expo start --tunnel
```

Leave this terminal open while using the app.

## 3. Open the app on Android

1. Connect the phone and computer to the internet.
2. Open Expo Go on the phone.
3. Select **Scan QR code**.
4. Scan the QR code displayed in the Expo terminal.
5. Wait for the app to bundle and load.

## 4. Stop the application

In each WSL terminal, press:

```text
Ctrl+C
```

## If the old Expo boilerplate appears

Stop Expo and restart with a cleared cache:

```bash
cd /home/matt/networth-app/mobile-app
nvm use 24
npx expo start --tunnel --clear
```

Close Expo Go completely, reopen it, and scan the new QR code.

## If the dashboard cannot load data

First confirm that the backend terminal is running.

On the phone, open this address in a web browser:

```text
http://192.168.4.52:5000/api/v1/accounts
```

If JSON appears, the API connection works. Restart Expo with `--clear`.

If the page does not open after restarting Windows or WSL, the WSL address may have changed.

In WSL, find the new address:

```bash
hostname -I
```

Then open **PowerShell as Administrator** and remove the old forwarding rule:

```powershell
netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=5000
```

Replace `NEW_WSL_IP` below with the first address returned by `hostname -I`:

```powershell
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=5000 connectaddress=NEW_WSL_IP connectport=5000
```

Confirm the forwarding rule:

```powershell
netsh interface portproxy show all
```

The Windows LAN address currently configured in the mobile app is:

```text
192.168.4.52
```
