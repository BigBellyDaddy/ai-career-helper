import { db } from "../firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  getDoc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";

//Create and update user profile 
export const upsertUserProfile = async (user) => {
  if (!user?.uid) return;

  const ref = doc(db, "users", user.uid);

//If the user was previosly created 
  const snap = await getDoc(ref);

  const payload = {
    uid: user.uid,
    displayName: user.displayName || "Użytkownik",
    email: user.email || "",
    photoURL: user.photoURL || "",
    provider: "google",
    lastLoginAt: serverTimestamp(),
  };

  if (!snap.exists()) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(ref, payload, { merge: true });
};

//Create new chat users/{uid}/chats/{chatId}
export const createChat = async (uid, title = "Nowy czat") => {
  const chatsRef = collection(db, "users", uid, "chats");

  const chatDoc = await addDoc(chatsRef, {
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return chatDoc.id;
};

//Save msg for users/{uid}/chats/{chatId}/messages/{messageId}
 
export const saveMessage = async (uid, chatId, role, content) => {
  const msgRef = collection(db, "users", uid, "chats", chatId, "messages");

  await addDoc(msgRef, {
    role, // "user" | "assistant"
    content,
    ts: Date.now(),
  });

  //updatedAt 
  const chatRef = doc(db, "users", uid, "chats", chatId);
  await setDoc(
    chatRef,
    { updatedAt: serverTimestamp() },
    { merge: true }
  );
};

//user chats
export const loadChats = async (uid) => {
  const chatsRef = collection(db, "users", uid, "chats");
  const q = query(chatsRef, orderBy("updatedAt", "desc"));

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

//msgs from chat 

export const loadMessages = async (uid, chatId) => {
  const msgsRef = collection(db, "users", uid, "chats", chatId, "messages");
  const q = query(msgsRef, orderBy("ts", "asc"));

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const deleteChat = async (uid, chatId) => {
  // delete messages
  const msgsRef = collection(db, "users", uid, "chats", chatId, "messages");
  const msgSnap = await getDocs(msgsRef);
  for (const d of msgSnap.docs) await deleteDoc(d.ref);

  // delete roadmaps
  const rmRef = collection(db, "users", uid, "chats", chatId, "roadmaps");
  const rmSnap = await getDocs(rmRef);
  for (const d of rmSnap.docs) await deleteDoc(d.ref);

  // delete chat
  const chatRef = doc(db, "users", uid, "chats", chatId);
  await deleteDoc(chatRef);
};


// update title chat
export const updateChatTitle = async (uid, chatId, title) => {
  const chatRef = doc(db, "users", uid, "chats", chatId);
  await updateDoc(chatRef, {
    title,
    updatedAt: serverTimestamp(),
  });
};

// save roadmap
export const saveRoadmap = async (uid, chatId, roadmap) => {
  const rmRef = collection(db, "users", uid, "chats", chatId, "roadmaps");

  const docRef = await addDoc(rmRef, {
    ...roadmap, 
    createdAt: serverTimestamp(),
  });

  // update at for chat
  const chatRef = doc(db, "users", uid, "chats", chatId);
  await setDoc(chatRef, { updatedAt: serverTimestamp() }, { merge: true });

  return docRef.id;
};

// all roadmaps 
export const loadRoadmaps = async (uid, chatId) => {
  const rmRef = collection(db, "users", uid, "chats", chatId, "roadmaps");
  const q = query(rmRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

// save roadmap
export const loadRoadmap = async (uid, chatId, roadmapId) => {
  const ref = doc(db, "users", uid, "chats", chatId, "roadmaps", roadmapId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};
// delete roadmap
export const deleteRoadmap = async (uid, chatId, roadmapId) => {
  const ref = doc(db, "users", uid, "chats", chatId, "roadmaps", roadmapId);
  await deleteDoc(ref);
};