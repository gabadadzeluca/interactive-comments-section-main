"use strict"; 

let currentImgSrc;
let currentUsername;

// pop up menu
const popUpMenu = document.querySelector('.pop-up-menu');
const deleteConfirm = popUpMenu.querySelector('[value="delete"]');
const cancelConfirm = popUpMenu.querySelector('[value="cancel"]');



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
  constructor(createdAt) {
    this.addedAt = new Date;
    this.replyingTo = '';
    this.content = ''; 
    this.createdAt = createdAt; 
    this.score = 0;
    this.user = {
      image: {
        webp: currentImgSrc
      },
      username: currentUsername,
    };
    this.replies = [];
  }

  get timeSinceCreated() {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - this.createdAt.getTime();
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    if(days < 1 && minutes > 59){
      return hours;
    }
    if(minutes > 60 && hours<24){
      return `${hours} hours ago`;
    }
    if(minutes < 60 && minutes>1){
      return `${minutes} minutes ago`
    }
    if(hours > 24 && minutes >1){
      return `${days} days ago`;
    }
    if(minutes == 0){
      return 'just now';
    }
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

      // update post buttons
      const updateBtns = document.querySelectorAll('.update-btn');


      if (replyBtns.length != 0) {
        replyBtns.forEach(btn=>{
          // get 'reply-to-div' elements
          const replyToDiv =  btn.parentElement.parentElement.parentElement.parentElement.querySelector('.reply-to-div');
          replyToDiv.style.display = 'none';
          btn.addEventListener('click', displayReply);
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
      if(editBtns.length != 0) {
        editBtns.forEach(button=>{
          button.addEventListener('click', displayEditDiv);
        });
      }
      if(deleteBtns.length != 0) {
        deleteBtns.forEach(button=>{
          button.addEventListener('click', deletePost);
        });
      }
      if(updateBtns.length != 0){
        updateBtns.forEach(btn=>{
          btn.addEventListener('click', updatePost);
        });
      }
    }
  });
});

observer.observe(document.querySelector('main'), { childList: true });

function displayCurrentUser(userData){
  currentImgSrc = userData.image.webp;
  currentUsername = userData.username;
  const footerImgs = document.querySelectorAll('footer img');
  footerImgs.forEach(img=>{
    img.src = currentImgSrc;
  });
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
  
  // score (desktop)
  commentHTML += '<div class="score desktop">' + `<p class="plus" data-voted="false">+</p><p class="score-count">${commentData.score}</p><p class="minus" data-voted="false">-</p>` + '</div>';

  // comment main 
  commentHTML += '<div class="comment-main">'
  // open inline div
  commentHTML += '<div class="inline">';
  // user div
  commentHTML += '<div class="user-and-date">';
  //add img
  commentHTML += '<div class="comment-author">' + `<img src=${commentData.user.image.webp}>` + '</div>';
  //add username
  commentHTML += '<div class="username">' + `<p>${commentData.user.username}</p></div>`;
  if(commentData.user.username == currentUsername){
    commentHTML += '<span class="user">you</span>';
  }
  // add date
  commentHTML += '<div class="date">' + commentData.createdAt + '</div>';
  // close user-date div
  commentHTML += '</div>';
  // if current user is the author let them delete or edit it
  // desktop layout buttons
  if(commentData.user.username == currentUsername){
    commentHTML += '<div class="buttons-div desktop">';
    commentHTML += '<div class="delete-btn">Delete</div>';
    commentHTML += '<div class="edit-btn">Edit</div>' +  '</div>';
  }else{
    // reply button
    commentHTML += '<div class="reply-btn  desktop">' + 'Reply' + '</div>';
  }
  // close inline div
  commentHTML += '</div>'
  
  // add tag
  let replyDiv;
  isReply? replyDiv = `<span class="tag">@${commentData.replyingTo} </span>` : replyDiv = '';

  //content div
  commentHTML += '<div class="comment-content">' + `<p>${replyDiv}${commentData.content}</p>`;
  // textarea for editing comment
  commentHTML += '<div class="comment-edit-div">';
  commentHTML += `<input class="comment-edit-form" type="textarea" value="${commentData.content}">`
  //add update button
  commentHTML += '<button class="update-btn" value="update">UPDATE</button>';
  // close comment-edit-div
  commentHTML += '</div>'
  // close content div
  commentHTML += '</div>'


  // open footer div of a comment/reply
  commentHTML += '<div class="footer-comment">'
  // score (mobile)
  commentHTML += '<div class="score mobile">' + `<p class="plus" data-voted="false">+</p><p class="score-count">${commentData.score}</p><p class="minus" data-voted="false">-</p>` + '</div>';


  if(commentData.user.username == currentUsername){
    commentHTML += '<div class="buttons-div mobile">';
    commentHTML += '<div class="delete-btn">Delete</div>';
    commentHTML += '<div class="edit-btn">Edit</div>' +  '</div>';
  }else{
    // reply button
    commentHTML += '<div class="reply-btn  mobile">' + 'Reply' + '</div>';
  }
  // close footer div
  commentHTML += '</div>';

  // close comment main
  commentHTML += '</div>';

  // close the comment div
  commentHTML += '</div>';

  // add reply div&button to every element
  commentHTML += '<div class="reply-to-div">' + `<img src=${currentImgSrc}>`;
  commentHTML += '<input type="textarea" class="reply-to-container">';
  commentHTML += '<button class="add-reply-btn">REPLY</button>';
  commentHTML += '</div>';

  //A add reply div for every comment
  commentHTML += '<div class="comment-replies">';
  // If the comment has replies display replies
  if (commentData.replies && commentData.replies.length > 0) {
    // Add HTML for each reply
    commentData.replies.forEach(function(reply) {
      commentHTML += createCommentHTML(reply, true);
    });
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

  const newComment = new Comment(new Date());
  newComment.content = input.value;
  newComment.createdAt = newComment.timeSinceCreated;
  // display comment
  commentHTML += createCommentHTML(newComment,false);
  document.querySelector('main').innerHTML = commentHTML;

  //reset value
  input.value = '';
}

const commentBtns = document.querySelectorAll('.add-comment-btn');
commentBtns.forEach(btn=>{
  btn.addEventListener('click', addComment);
});


let replyingTo;
function displayReply(){
  // parent container
  const parentDiv = this.parentElement.parentElement.parentElement.parentElement;

  // comment/reply that user is replying to
  const commentDiv = this.parentElement.parentElement.parentElement;
  // pop up reply div
  const replyInputDiv = parentDiv.querySelector('.reply-to-div');
  // if closed pop up
  if(replyInputDiv.style.display == 'none'){
    replyInputDiv.style.display = 'inline-flex';
  }else{//close
    replyInputDiv.style.display = 'none';
  }

  // get comment/reply div 
  replyingTo = commentDiv.querySelector('.username').innerText;

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


  // create new reply
  const newReply = new Comment(new Date());
  newReply.createdAt = newReply.timeSinceCreated;

  newReply.replyingTo = replyingTo;
  if(input.value.slice(1,spaceIndex) !== replyingTo){
    newReply.content = input.value;
  }else{
    newReply.content = input.value.slice(spaceIndex); // get everything except the tag word

  }

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
  let score = this.parentElement.querySelector('.score-count').innerHTML;
  // get both elements
  let oppositeAction = action === '+' ? 'minus' : 'plus';
  let oppositeElement = this.parentElement.querySelector(`.${oppositeAction}`);
  
  if(action == '+'){
    score++;
  }else{
    score--;
  }
  
  this.parentElement.querySelector('.score-count').innerHTML = score;
  this.setAttribute('data-voted', true);
  // if they're both clicked, the value is same, reset both to false;
  if(this.getAttribute('data-voted') == "true" && oppositeElement.getAttribute('data-voted') == "true"){
    this.setAttribute('data-voted', false);
    oppositeElement.setAttribute('data-voted', false);
  }

}

// let user delete their posts
function deletePost(){
  const commentContainer = this.parentElement.parentElement.parentElement.parentElement;
  const reply = this.parentElement.parentElement;

  // pop up a menu
  popUpMenu.style.display = 'flex';
  //darken the body
  document.querySelectorAll('body *').forEach(element=>{
    if(element != commentContainer || element != reply){
      element.style.filter = 'brightness(96%)';
    }
  });
  document.querySelector('body').style.background = 'hsl(214, 25%, 95%)';
  document.querySelector('body').style.overflow = 'hidden';
  deleteConfirm.addEventListener('click', ()=>{
    if(reply.className == 'reply'){
      reply.remove();
    }else{
      commentContainer.remove();
    }
    hideMenu();
  });

  cancelConfirm.addEventListener('click', ()=>{
    hideMenu();
  });
}


function hideMenu(){
  popUpMenu.style.display = 'none';
  document.querySelector('body').style.background = 'var(--light-gray)';
  document.querySelector('body').style.overflow = 'scroll';
  document.querySelectorAll('body *').forEach(element=>{
    element.style.filter = 'brightness(100%)';
  });
}

function displayEditDiv(){
  // comment/reply div
  const commentDiv = this.parentElement.parentElement.parentElement;
  const editDiv = commentDiv.querySelector('.comment-edit-div');

  //hide comment-content
  const content = commentDiv.querySelector('.comment-content p');
  content.style.display = 'none';
  //display edit div
  editDiv.style.display = 'flex';
}


function updatePost(){
  const input = this.parentElement.querySelector('input')
  const commentContent = this.parentElement.parentElement.querySelector('p');
  // save tag
  const tag = commentContent.querySelector('span');
  if(tag != undefined){
    commentContent.innerHTML = '<span class="tag">' +  tag.innerHTML + '</span> ' + input.value;
  }else{
    commentContent.innerHTML = input.value;
  }
  input.parentElement.style.display = 'none';
  commentContent.style.display = 'block';
}
