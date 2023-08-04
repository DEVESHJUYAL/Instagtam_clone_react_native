import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect,useState } from 'react'
import Header from '../components/home/Header'
import Stories from '../components/home/Stories'
import Post from '../components/home/Post'
import { POSTS } from '../data/posts'
import BottomTabs from '../components/BottomTabs'
import { bottomTabIcons } from '../components/BottomTabs'
import { db } from '../firebase'
import { collectionGroup, onSnapshot, orderBy, query, getDocs, collection, usersQuerySnapshot} from 'firebase/firestore'

const HomeScreen = ({ navigation }) => {
 const [posts, setPosts] = useState([])
 
 useEffect(() => {
    const fetchPosts = async () => {
      try {
        const usersQuerySnapshot = await getDocs(collection(db, 'users'));
        const allPosts = [];

        for (const userDoc of usersQuerySnapshot.docs) {
          const postsQuerySnapshot = await getDocs(collection(userDoc.ref, 'posts'));
          postsQuerySnapshot.forEach((postDoc) => {
            const post = { id: postDoc.id, ...postDoc.data() };
            allPosts.push(post);
          });
        }

        allPosts.sort((a, b) => b.createdAt - a.createdAt);
        setPosts(allPosts);

        // Set up the real-time listener for the entire 'posts' collection
        const postsRef = collectionGroup(db, 'posts');
        const unsubscribe = onSnapshot(
          query(postsRef, orderBy('createdAt', 'desc')),
          (snapshot) => {
            const updatedPosts = snapshot.docs.map((post) => ({
              id: post.id,
              ...post.data()
            }));
            setPosts(updatedPosts);
          }
        );

        // Clean up the snapshot listener when the component unmounts.
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    // Fetch the initial posts
    fetchPosts();
  }, []);
     
    return (
        <SafeAreaView style={styles.container}>
            <Header navigation={navigation} />
            <Stories />
            <ScrollView>
                {posts.map((post) => (
                    <Post post={post} key={post.id} />
                ))}
            </ScrollView>
            <BottomTabs icons={bottomTabIcons} />
        </SafeAreaView>
    )
}




const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
    },
})


export default HomeScreen