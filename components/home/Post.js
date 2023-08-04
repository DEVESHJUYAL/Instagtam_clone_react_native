import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import { Divider } from 'react-native-elements'
import { auth, db } from '../../firebase'
import { arrayUnion, arrayRemove, updateDoc, doc, collection} from 'firebase/firestore'

const postFooterIcons = [
    {
        name: 'Like',
        imageUrl: require('../../assets/like.png'),
        likedImageUrl: require('../../assets/likedicon.png')
    },
    {
        name: 'Comment',
        imageUrl: require('../../assets/comment.png'),
    },
    {
        name: 'Share',
        imageUrl: require('../../assets/share.png'),
    },
    {
        name: 'Save',
        imageUrl: require('../../assets/save.png'),
    },

]

const Post = ({ post }) => {

    const handlelike = (post) => {
        if (!post.likes_by_user || !Array.isArray(post.likes_by_user)) {
            console.log('likes_by_user is not properly initialized or is not an array');
            return;
          }
        const currentLikeStatus = !post.likes_by_user.includes(auth.currentUser.email);
      
        const postRef = doc(
          collection(db, 'users', post.owner_email, 'posts'),
          post.id
        );
      
        updateDoc(postRef, {
          likes_by_user: currentLikeStatus
            ? arrayUnion(auth.currentUser.email)
            : arrayRemove(auth.currentUser.email),
        })
          .then(() => {
            console.log('Document successfully updated');
          })
          .catch((error) => {
            console.log('Error updating document', error);
          });
      };

    return (
        <View style={{ marginBottom: 30 }}>
            <Divider width={1} orientation='vertical' />
            <PostHeader post={post} />
            <PostImage post={post} />
            <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                <PostFooter post={post} handlelike={handlelike} />
                <Likes post={post} />
                <Caption post={post} />
                <CommentSection post={post} />
                <Comments post={post} />
            </View>
        </View>
    )
}

const PostHeader = ({ post }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{uri: post.profile_picture}} style={styles.story} />
            <Text style={{ color: 'white', marginLeft: 5, fontWeight: '700' }}>{post.user}</Text>
        </View>
        <Text style={{ color: 'white', fontWeight: '900' }}>...</Text>
    </View>
)


const PostImage = ({ post }) => (
    <View style={{ width: '100%', height: 450 }}>
        <Image source={{uri:post.imageUrl}} style={{ height: '100%', width: '100%', resizeMode: 'cover' }} />
    </View>
)

const PostFooter = ({handlelike, post}) => (
    <View style={{ flexDirection: "row" }}>
        <View style={styles.leftFooterIconsContainer}>
          <TouchableOpacity onPress={() => handlelike(post)}>
           <Image style={styles.footerIcon} source={post.likes_by_user.includes(auth.currentUser.email)? postFooterIcons[0].likedImageUrl : postFooterIcons[0].imageUrl}/>
           </TouchableOpacity>
            <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[1].imageUrl} />
            <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[2].imageUrl} />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[3].imageUrl} />
        </View>
    </View>

)

const Icon = ({ imgStyle, imgUrl }) => (
    <TouchableOpacity>
        <Image style={imgStyle} source={imgUrl} />
    </TouchableOpacity>
)

const Likes = ({ post }) => (
    <View style={{ flexDirection: "row", marginTop: 4 }}>
        <Text style={{ color: 'white', fontWeight: '600' }}>{post.likes_by_user.length.toLocaleString('en')} likes</Text>
    </View>
)

const Caption = ({ post }) => (
    <View style={{ flexDirection: 'row', marginTop: 4 }}>
        <Text style={{ color: "white" }}>
            <Text style={{ fontWeight: '800' }}>{post.user}</Text>
            <Text> {post.caption}</Text>
        </Text>
    </View>

)

const CommentSection = ({ post }) => (
    <View style={{ marginTop: 5 }}>
        {!!post.comments.length && (
            <Text style={{ color: 'gray' }}>View{post.comments.length > 1 ? ' all ' : ''} {post.comments.length}{' '}
                {post.comments.length > 1 ? 'comments' : 'comment'}</Text>)}
    </View>
)

const Comments = ({ post }) => (
    <>
        {post.comments.map((comment, index) => (
            <View key={index} style={{ flexDirection: 'row', marginTop: 5 }}>
                <Text style={{ color: 'white' }}>
                    <Text style={{ fontWeight: '800' }}>{comment.user}</Text>{' '}
                    {comment.comment}
                </Text>
            </View>
        ))}
    </>
)


const styles = StyleSheet.create({
    story: {
        width: 35,
        height: 35,
        borderRadius: 50,
        marginLeft: 6,
        borderWidth: 1.6,
        borderColor: '#ff8501',
    },

    footerIcon: {
        width: 33,
        height: 33,
    },

    leftFooterIconsContainer: {
        flexDirection: "row",
        width: '32%',
        justifyContent: 'space-between',
    }
})

export default Post