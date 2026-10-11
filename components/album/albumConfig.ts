// ============================================================
//  ALBUM CONFIG — Edit this file to personalise your album!
// ============================================================

export interface AlbumPage {
  /** Path relative to /public — e.g. "/photos/beach.jpg" */
  image: string;
  /** Caption shown at the bottom of the page */
  caption: string;
  /** Optional date string shown above the caption */
  date?: string;
  /** Optional handwritten note or story written on the back of the photo */
  story?: string;
}

export interface Song {
  title: string;
  artist: string;
  /** Path relative to /public — e.g. "/music/our-song.mp3" */
  src: string;
}

// ── Cover ─────────────────────────────────────────────────────
export const COVER_CONFIG = {
  title: "Happy Anniversary Lang💕", // ← Put your title here
  names: "Cis & Stel's Anniversary", // ← Put your names here
  date: "October 13, 2026",  // ← Put your anniversary date here
  coverImage: "/photos/Photo 1.jpg", // ← Optional: replace with your cover photo
};

// ── Pages ─────────────────────────────────────────────────────
// Add as many pages as you like.
// Drop your photos into /public/photos/ and reference them here.
export const ALBUM_PAGES: AlbumPage[] = [
  {
    image: "/photos/Cover Photo.jpg",
    caption: "Where it all started🌸",
    date: "2019",
    story: "This is where it all started. When we first fell in love sa STC and until now that we have graduated from college. Happy 7 years lang! 💕",
  },
  {
    image: "/photos/Photo 9.jpg",
    caption: "Our first Pickle Together 🥒",
    date: "Dinkin Park",
    story: "I remember when we first played pickleball, you were enjoying so much and you were so cute. This is how our pickleball journey happened. ",
  },
  {
    image: "/photos/Photo 11.jpg",
    caption: "Sponti Suroy sa Busay 🌄",
    date: "Busay, Cebu City",
    story: "I wont forget this moment, because I couldn't believe na dala ko aning sponti suroy sa Busay with your family. I was so happy that your family liked me and I was happy to be a part of something that you loved so much.",
  },
  {
    image: "/photos/Photo 3.jpg",
    caption: "Movie Night at your house ✨",
    date: "Stella's House",
    story: "I'm So happy that we get to spend time at your house watching movies together. After so many years, finally maka anha nako anytime. BTW Friends nami ni Paco",
  },
  {
    image: "/photos/Photo 5.jpg",
    caption: "Spending pikol time with you 💕",
    date: "Dink City",
    story: "Happy Anniversary, Lang! Thank you for always being there with me, especially through my ups and downs sa life. And enjoying the things I enjoy also. You mean the world to me",
  },
  {
    image: "/photos/Photo 4.jpg",
    caption: "Birthday nako hehehe",
    date: "Fishing",
    story: "Although you had a very busy schedule, you still made time for me on my birthday with my family. And I hope we get to spend more birthdays to come together.",
  },
  {
    image: "/photos/Photo 7.jpg",
    caption: "Spiderman Movie time",
    date: "Seaside",
    story: "To more Movie dates with my favorite person in the world, Happy we got to see spiderman and next goal nato is concerts!!",
  },
  {
    image: "/photos/Photo 6.jpg",
    caption: "Going back to the Cooe Dates 💕",
    date: "Cooe",
    story: "I love spending dates with you just like before, it brings back good memories. If I were given the chance to go back in time, I would repeat the same choices with you over and over again.",
  },
  {
    image: "/photos/Photo 14.jpg",
    caption: "One of the Best Gifts You have Given me",
    date: "Tipolo, East West",
    story: "You always supported my hobbies, which is why, I am super grateful to you. Other than you being the greatest gift I have ever received, this paddle was something I never expected.",
  },
  {
    image: "/photos/Photo 12.jpg",
    caption: "Work Time + Me",
    date: "Pier 1",
    story: "I see you like a super hero, you always make time for family, for me, and for your friends. You will always find a way no matter how busy you are, that's why I will always support you.",
  },
  {
    image: "/photos/Photo 13.jpg",
    caption: "Sleeping whenever im near you",
    date: "Entertainment Room",
    story: "It will always make me happy, that you find peace and relaxation whenever you are with me. That's why I want you to rely on me because I will always be there for you.",
  },
  {
    image: "/photos/Photo 10.jpg",
    caption: "Breaky Dates with my Favorite Person with Waffles",
    date: "Brown Cup",
    story: "I love spending time with you, especially when we get to eat together. Its always my love language that I want to spend time with you and eat good food together. Food will always taste so good whenever we eat together.",
  },
  {
    image: "/photos/Photo 89.jpg",
    caption: "Favorite Pic",
    date: "Stella's old house",
    story: "Whenever I make you happy, this is what I remember the most. I love treating you like a princess just like how the litte Stella always wanted to be treated.",
  },
];

// ── Finale Page (Inside Back Cover) ───────────────────────────
// Edit the closing message and details shown on the last page of the album.
export const FINALE_CONFIG = {
  badge: "✨ To Be Continued",
  title: "I love you Stella 💕",
  message:
    "I know not every photo was in this album, but each page is a piece of my heart with you. Thank you for loving me after all this time, Stella. I love you so much. Happy Anniversary!",
  date: "October 13, 2026", // Optional override (defaults to COVER_CONFIG.date)
  signature: "Cis & Stel's year together", // Optional signature (defaults to COVER_CONFIG.names)
  closeButtonText: "Close Album",
};

// ── Music Playlist ─────────────────────────────────────────────
// Drop your .mp3 / .ogg files into /public/music/ and list them here.
// Songs will loop through automatically.
export const PLAYLIST: Song[] = [
  {
    title: "Your Song",
    artist: "Parokya ni Edgar", // ← Replace with your actual artist name
    src: "/music/Your Song.mp3", // ← Replace with your actual song file
  },
  {
    title: "Bibingka",
    artist: "Ben & Ben", // ← Replace with your actual artist name
    src: "/music/Bibingka.mp3", // ← Replace with your actual song file
  },
  // {
  //   title: "Song Title",
  //   artist: "Artist Name",
  //   src: "/music/song2.mp3",
  // },
];
