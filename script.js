"use strict"; 

let currentImg;
let currentUsername;

fetch('data.json')
.then(response => response.json())
  .then(data => {
    let comments = data.comments;
    //display current user
    displayCurrentUser(data.currentUser);
    displayComments(comments);
    
    
  });

let commentHTML = '';
function displayComments(comments){
    for(let i = 0; i<comments.length; i++){
        commentHTML += createCommentHTML(comments[i], false);
    }
    document.querySelector('main').innerHTML = commentHTML;
}


// comment class
class Comment {
  constructor() {
    this.content = '';   //input.value;
    this.createdAt = 'just now'; //change
    this.score = 0;
    this.user = {
      image: {
        webp: currentImg.src
      },
      username: currentUsername,
    };
    this.replies = [];
  }
} 

// check for replybtns
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === "childList") {
      const replyBtns = document.querySelectorAll('.reply-btn');
      if (replyBtns.length != 0) {
        replyBtns.forEach(btn=>{
          btn.addEventListener('click', addReply);
        });
      }
    }
  });
});

observer.observe(document.querySelector('main'), { childList: true });


function displayCurrentUser(userData){
  currentImg = document.querySelector('footer img');
  currentImg.src = userData.image.webp;
  currentUsername = userData.username;
  console.log("logged in as "+currentUsername);
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
  commentHTML += '<div class="reply-btn">' + 'Reply' + '</div>';
  
  // close the comment div
  commentHTML += '</div>';

  // add reply div&button to every element
  commentHTML += '<div class="reply-to-div">' + `<img src=${currentImg.src}>`;
  commentHTML += '<input type="textarea" class="reply-to-container">';
  commentHTML += '<button class="add-reply-btn">REPLY</button>';
  commentHTML += '</div>';

  //A add reply div for every comment
  commentHTML += '<div class="comment-replies">';
  // If the comment has replies display replies
  if (commentData.replies && commentData.replies.length > 0) {
    // commentHTML += '<div class="comment-replies">';
    // Add HTML for each reply
    commentData.replies.forEach(function(reply) {
      commentHTML += createCommentHTML(reply, true);
    });
    // commentHTML += '</div>';
  }
  commentHTML += '</div>';

  if (!isReply) {
    commentHTML += '</div>';
  }
  return commentHTML;
}



function addComment(){
  // get input
  const input = document.getElementById('new-comment');
  if(input.value.length == 0) return; // stop if it's empty
  console.log(input.value);

  const newComment = new Comment;
  newComment.content = input.value;
  // display comment
  commentHTML += createCommentHTML(newComment,false);
  document.querySelector('main').innerHTML = commentHTML;

  //reset value
  input.value = '';
}

const commentBtn = document.getElementById('add-comment-btn');
commentBtn.addEventListener('click', addComment);


function addReply(){
  let parentDiv = this.parentElement.parentElement;
  if(parentDiv.classList == 'comment-thread'){
    parentDiv = parentDiv.children[1];
  }


  // comment/reply that user is replying to
  const commentDiv = this.parentElement;
  console.log("comment/reply:",commentDiv);
  console.log(parentDiv);
  


}



