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
    this.replyingTo = '';
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

// check for elements added from js
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === "childList") {

      //reply buttons
      const replyBtns = document.querySelectorAll('.reply-btn');
      // reply input-div buttons
      const replyInputs = document.querySelectorAll('.reply-to-div button');
      
      // score div elemenets
      const scorePluses = document.querySelectorAll('.plus');
      const scoreMinuses = document.querySelectorAll('.minus');

      //delete post buttons
      const deleteBtns = document.querySelectorAll('.delete-btn');
      // edit post buttons
      const editBtns = document.querySelectorAll('.edit-btn');
      if (replyBtns.length != 0) {
        replyBtns.forEach(btn=>{
          // get 'reply-to-div' elements
          const replyToDiv =  btn.parentElement.parentElement.children[1];
          replyToDiv.style.display = 'none';
          btn.addEventListener('click', displayReply)
        });
      }
      if(replyInputs.length != 0) {
       replyInputs.forEach(button=>{
        button.addEventListener('click', addReply);
       });
      }
      if(scoreMinuses.length != 0 && scorePluses.length != 0){
        scoreMinuses.forEach(minus=>{
          minus.addEventListener('click', changeScore);
        });
        scorePluses.forEach(plus=>{
          plus.addEventListener('click', changeScore)
        });
      }
      if(editBtns.length != 0){
        console.log(editBtns);
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
  // open container div
  commentHTML += `<div class="${className}-container">`;

  commentHTML += `<div class=${className}>`;

  // open inline div
  commentHTML += '<div class="inline">';
  //add img
  commentHTML += '<div class="comment-author">' + `<img src=${commentData.user.image.webp}>` + '</div>';
  //add username
  commentHTML += '<div class="username">' + `<p>${commentData.user.username}</p></div>`;
  // add date
  commentHTML += '<div class="date">' + commentData.createdAt + '</div>';

  // if current user is the author let them delete or edit it
  if(commentData.user.username == currentUsername){
    commentHTML += '<div class="buttons-div">';
    commentHTML += '<button class="delete-btn">Delete</button>';
    commentHTML += '<button class="edit-btn">Edit</button>' +  '</div>';
  }

  // close inline div
  commentHTML += '</div>'
  
  // add tag
  let replyDiv;
  isReply? replyDiv = `<span class="tag">@${commentData.replyingTo}</span>` : replyDiv = '';

  //content div
  commentHTML += '<div class="comment-content">' + `<p>${replyDiv}${commentData.content}</p>` + '</div>';

  // score
  commentHTML += '<div class="score">' + `<p class="plus" data-voted="false">+</p><p class="score-count">${commentData.score}</p><p class="minus" data-voted="false">-</p>` + '</div>';

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

  // close the container
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


let replyingTo;
function displayReply(){
  
  // parent container
  const parentDiv = this.parentElement.parentElement;
  // comment/reply that user is replying to
  const commentDiv = this.parentElement;
  // pop up reply div
  const replyInputDiv = parentDiv.children[1];
  // if closed pop up
  if(replyInputDiv.style.display == 'none'){
    replyInputDiv.style.display = 'inline-flex';
  }else{//close
    replyInputDiv.style.display = 'none';
  }

  // get comment/reply div 
  replyingTo = commentDiv.children[0].querySelector('.username').innerText;

  //access input div
  const input = replyInputDiv.querySelector('input');
  // tag the user
  input.value = '@' + replyingTo + ' ';

}



function addReply(){
  const input = this.parentElement.children[1];
  // Find the first space in the string
  const spaceIndex = input.value.indexOf(" ");
  if(input.value.slice(spaceIndex + 1).length == 0) return; // stop if it's empty

  // create new reply div
  const newReply = new Comment();
  newReply.replyingTo = replyingTo;
  newReply.content = input.value.slice(spaceIndex); // get everything except the tag word
  
  // div that the comment will be appended to  
  let replyToDiv = (this.parentElement.parentElement.lastElementChild);
  replyToDiv.innerHTML += createCommentHTML(newReply, true);
  document.querySelector('main').innerHTML + replyToDiv;

  // append an empty element so that observer detects the changes
  const newDiv = document.createElement('div');
  document.querySelector('main').appendChild(newDiv);
  newDiv.remove(); // remove the element
}


// add and subtract score
function changeScore(){
  if(this.getAttribute('data-voted') == 'true') return;
  let action = this.innerHTML;
  let score = this.parentElement.children[1].innerHTML;

  // get both elements
  let oppositeAction = action === '+' ? 'minus' : 'plus';
  let oppositeElement = this.parentElement.querySelector(`.${oppositeAction}`);
  
  if(action == '+'){
    score++;
  }else{
    score--;
  }
  
  this.parentElement.children[1].innerHTML = score;
  this.setAttribute('data-voted', true);
  // if they're both clicked, the value is same, reset both to false;
  if(this.getAttribute('data-voted') == "true" && oppositeElement.getAttribute('data-voted') == "true"){
    this.setAttribute('data-voted', false);
    oppositeElement.setAttribute('data-voted', false);
  }


  // add class to style checked element
}


// let user delete their posts


