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
  deleteDoc
} from "firebase/firestore";

//Create and update user profile 
export const upsertUserProfile = async (user) => {
  if (!user?.uid) return;

  const ref = doc(db, "users", user.uid);

//if the user was previosly created 
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

/**
 * Создаёт новый чат:
 * users/{uid}/chats/{chatId}
 */
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
  // delete msg
  const msgsRef = collection(db, "users", uid, "chats", chatId, "messages");
  const snap = await getDocs(msgsRef);

  for (const d of snap.docs) {
    await deleteDoc(d.ref);
  }

  // delete chat
  const chatRef = doc(db, "users", uid, "chats", chatId);
  await deleteDoc(chatRef);
};
