# Meme Maker
Built with Next.JS, Supabase, Tailwind, and Fabric.JS. Under Supabase specifically, the services integrated include the database itself, authentication and storage, along with the relevant security rules written via policies. Oh and everything was done via the Supabase dashboard which is really nifty.

A project built for [Supabase's Hackathon]('https://supabase.io/blog/2021/07/30/1-the-supabase-hackathon'), probably will not be maintained thereafter. A very simplified interface to build, export, and share memes! You don't have to be logged-in to make memes, but creating an account will allow you to save your memes and publish it to our tiny but growing community.

https://user-images.githubusercontent.com/19742402/128484051-e9415811-3395-41cc-967d-a1f916e0cf91.mp4

## Features
- Start with either selecting a template or uploading your own image
- Add/format textboxes to your meme
- Add stickers to your meme
- Adjust the layer order of each element
- Copy/pasting elements in the canvas
- Save your memes or export directly to PNG
- View all memes created by everyone

## Running locally

Just the usual simple steps:
```
npm install
npm run dev
```

## Additional features I'd have added
- Definitely more templates
- Allow users to edit their saved memes
- Add more community features like liking memes and a "Meme of the Month" title
- Show trending templates that are being used
- Add undo functionality to the editor
- Allow adding of custom images to the editor (apart from a curated list of stickers)
