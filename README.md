# StyleMaster

Effortless and fashionable outfits, picked in record time. Our mobile app was designed to allow the user to curate different outfits from reliable clothing store outlets easily! Runs on both iOS and Android.

## Demo

Watch demo video [here](https://youtu.be/f7-Iza4QI_o)
[![thumbnail](./assets/thumbnail.png)](https://youtu.be/f7-Iza4QI_o)

## Screenshots

<img src="./assets/home.gif" width="40%">
<img src="./assets/preferences.png" width="40%">
<img src="./assets/loading.gif" width="40%">
<img src="./assets/browse.png" width="40%">
<img src="./assets/gallery.jpeg" width="40%">

<!-- ![home](./assets/home.gif)
![preferences](./assets/preferences.png)
![loading](./assets/loading.gif)
![browse](./assets/browse.png)
![gallery](./assets/gallery.jpeg) -->

## How to set up:

1. [Setup Expo environment according to Docs](https://docs.expo.dev/get-started/set-up-your-environment/)
2. Run the following commands:

For macos:

```bash
cd frontend
npm install
npx expo start
cd ../backend
mkdir images/tops
mkdir images/bottoms
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install
```

For windows:

```bash
cd frontend
npm install
npx expo start
cd ../backend
mkdir images/tops
mkdir images/bottoms
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
playwright install
```

## How to run:

1. Start the backend server by running `python3 app.py` in the `/backend` terminal.
2. Start the frontend Expo app:
   - Run `npx expo start` in the `/frontend` terminal and scan the QR code using the Expo Go app or enter in the URL

<!-- ## Deployment

Web version of this mobile app is now deployed on Hack Club Nest!! You can access it [here](https://sunray4.hackclub.app). Create your own account, or login with the following credentials to test the app:

- Username: `test@test.com`
- Password: `style`

Unfortunately, the browse feature isnt available in this deployed version as nest doesn't support non-headless web scrapers. -->
