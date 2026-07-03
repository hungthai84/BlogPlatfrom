import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: any;
}

export function Comments({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'articles', articleId, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });
    return unsubscribe;
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    await addDoc(collection(db, 'articles', articleId, 'comments'), {
      authorName,
      content: newComment,
      createdAt: new Date()
    });
    setNewComment('');
  };

  return (
    <div className="mt-10 p-6 bg-white dark:bg-brand-dark-card rounded-lg liquid-glass">
      <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Bình luận</h3>
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input 
          placeholder="Tên của bạn" value={authorName} onChange={e => setAuthorName(e.target.value)}
          className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-transparent"
        />
        <textarea 
          placeholder="Viết bình luận..." value={newComment} onChange={e => setNewComment(e.target.value)}
          className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-transparent"
        />
        <button type="submit" className="bg-brand-blue text-white px-4 py-2 rounded">Gửi</button>
      </form>
      <div className="space-y-4">
        {comments.map(c => (
          <div key={c.id} className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <p className="font-bold">{c.authorName}</p>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
