$(document).ready(function() {
  var items = [];
  var itemsRaw = [];

  $.getJSON('/api/books', function(data) {
    //var items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
      return i !== 14;
    });
    if (itemsRaw.length > 15) {
      items.push('<p>...and ' + (data.length - 15) + ' more!</p>');
    }
    $('<ul/>', {
      class: 'listWrapper',
      html: items.join('')
    }).appendTo('#display');
  });

  var comments = [];
  $('#display').on('click', 'li.bookItem', function() {
    $('#detailTitle').html('<b>' + itemsRaw[this.id].title + '</b> (id: ' + itemsRaw[this.id]._id + ')');
    $.getJSON('/api/books/' + itemsRaw[this.id]._id, function(data) {
      comments = [];
      $.each(data.comments, function(i, val) {
        comments.push('<li>' + val + '</li>');
      });
      comments.push(
        '<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>'
      );
      comments.push('<br><button class="btn btn-info addComment" id="' + data._id + '">Add Comment</button>');
      comments.push('<button class="btn btn-danger deleteBook" id="' + data._id + '">Delete Book</button>');
      $('#detailComments').html(comments.join(''));
    });
  });

  $('#bookDetail').on('click', 'button.deleteBook', function() {
    const idind = this.id;
    $.ajax({
      url: '/api/books/' + this.id,
      type: 'delete',
      success: function(data) {
        //update list
        const ind = itemsRaw.findIndex(val => val._id === idind);
        console.log(data);
        $('#' + ind).remove();
        $('#detailComments').empty();
        $('#detailTitle').html('<p id="detailTitle">Select a book to see it\'s details and comments</p>');
      }
    });
  });

  $('#bookDetail').on('click', 'button.addComment', function() {
    var newComment = $('#commentToAdd').val();
    $.ajax({
      url: '/api/books/' + this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        //adds new comment to bottom of list
        comments.splice(comments.length - 3, 0, '<li>' + newComment + '</li>');
        $('#detailComments').html(comments.join(''));
      }
    });
  });

  $('#newBook').click(function(e) {
    e.preventDefault();
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
        itemsRaw.push({ _id: data._id, title: data.title, comments: data.comments });

        if (itemsRaw.length > 15) {
          if ($('.listwrapper p')[0]) {
            $('.listwrapper p')[0].textContent = '...and ' + (itemsRaw.length - 15) + ' more!';
          } else {
            $('.listwrapper').append('<p>...and ' + (itemsRaw.length - 15) + ' more!');
          }
        } else {
          $('.listwrapper').append('<li class="bookItem" id="' + (itemsRaw.length - 1) + '">' + data.title + ' - ' + data.comments.length + ' comments</li>');
        }
      }
    });
  });

  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      // dataType: 'json',
      // data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
        console.log(data);
        console.log('Success! Books confirmed deleted.');
        itemsRaw = [];
        $('.listwrapper').empty();
      },
      error: function() {
        console.log(arguments);
      }
    });
  });
});
