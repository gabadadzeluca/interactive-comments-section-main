"use strict"; 

let currentImg;
let currentUsername;


fetch('data.json')
.then(response => response.json())
  .then(data => {
    let comments = data.comments;
    displayComments(comments);
    //display current user
    displayCurrentUser(data.currentUser);
  });

let commentHTML = '';
function displayComments(comments){
    for(let i = 0; i<comments.length; i++){
        commentHTML += createCommentHTML(comments[i], false);
    }
    document.querySelector('main').innerHTML = commentHTML;
}


function createCommentHTML(commentData, isReply) {
  // Build the HTML for the comment
  let commentHTML = '';
  if (!isReply) {
    commentHTML += '<div class="comment-thread">';
  }
  let className;
  if(isReply){
    className = 'reply';
  }else{
    className = 'comment';
  }

  commentHTML += `<div class=${className}>`;

  // open inline div
  commentHTML += '<div class="inline">';
  //add img
  commentHTML += '<div class="comment-author">' + `<img src=${commentData.user.image.webp}>` + '</div>';
  //add username
  commentHTML += '<div class="username">' + `<p>${commentData.user.username}</p></div>`;
  // add date
  commentHTML += '<div class="date">' + commentData.createdAt + '</div>';
  // close inline div
  commentHTML += '</div>'


  
  // add tag
  let replyDiv;
  isReply? replyDiv = `<span class="tag"> ${commentData.replyingTo} </span>` : replyDiv = '';

  //content div
  commentHTML += '<div class="comment-content">' + `<p>${replyDiv}${commentData.content}</p>` + '</div>';

  // score
  commentHTML += '<div class="score">' + `<p class="plus">+</p><p class="score-count">${commentData.score}</p><p class="minus">-</p>` + '</div>';

  // reply button
  commentHTML += '<div class="replyBtn">' + 'Reply' + '</div>';
  
  // close the comment div
  commentHTML += '</div>';


  // If the comment has replies, add a div for the replies
  if (commentData.replies && commentData.replies.length > 0) {
    commentHTML += '<div class="comment-replies">';
    // Add HTML for each reply
    commentData.replies.forEach(function(reply) {
      commentHTML += createCommentHTML(reply, true);
    });
    commentHTML += '</div>';
  }

  // commentHTML += '</div>';
  if (!isReply) {
    commentHTML += '</div>';
  }
  return commentHTML;
}

function displayCurrentUser(userData){
  currentImg = document.querySelector('footer img');
  currentImg.src = userData.image.webp;
  currentUsername = userData.username;
  console.log("logged in as "+currentUsername);
}


function addComment(){
  // get input
  const input = document.getElementById('new-comment');
  if(input.value.length == 0) return; // stop if it's empty
  console.log(input.value);
  // create a new object
  function Comment(){
    this.content = input.value;
    this.createdAt = '';
    this.score =  0;
    this.user = {
      image:{
        webp: currentImg.src
      },
      username: currentUsername,
    };
    this.replies = [];
  } 
  // newComment.content = input.value;
  const newComment = new Comment;
  console.log(newComment.user.image.webp);

  commentHTML += createCommentHTML(newComment,false);
  document.querySelector('main').innerHTML = commentHTML;

}

const commentBtn = document.getElementById('add-comment-btn');
console.log(commentBtn);
commentBtn.addEventListener('click', addComment);
