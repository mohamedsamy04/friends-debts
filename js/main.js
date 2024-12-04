$(document).ready(function() {
    loadFriends(); 

    $('#add-friend-btn').click(function() {
        if ($(this).data('is-editing')) {
            updateFriend(); 
        } else {
            addFriend();
        }
    });

    function addFriend() {
        var friendName = $('#friend-name').val();
        var friendAmount = parseFloat($('#amount').val());
        var transactionType = $('#transaction-type').val();

        if (friendName === '' || isNaN(friendAmount) || friendAmount === '') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'الرجاء إدخال اسم ومبلغ صالح.',
                showConfirmButton: false,
                timer: 3000
            });
        } else if (friendAmount <= 0) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'الرجاء إدخال مبلغ أكبر من صفر.',
                showConfirmButton: false,
                timer: 3000
            });
        } else {
            var newFriend = $('<li class="friend"></li>');
            var nameBox = $('<span class="friend-name"></span>').text(friendName);  
            var amountBox = $('<div class="amount-box"></div>').text(friendAmount + ' جنيه');
            var editBtn = $('<button class="edit-btn"><i class="fas fa-edit"></i></button>');
            var deleteBtn = $('<button class="delete-btn"><i class="fas fa-trash"></i></button>');

            if (transactionType === 'ديون') {
                amountBox.addClass('debt');
            } else {
                amountBox.addClass('due');
            }

            editBtn.click(function() {
                $('#friend-name').val(friendName);
                $('#amount').val(friendAmount);
                $('#transaction-type').val(transactionType);
                $('#add-friend-btn').data('is-editing', true).data('friend-id', $(this).parent().index());
            });

            deleteBtn.click(function() {
                $(this).parent().addClass('fade-out');
                setTimeout(function() {
                    $(this).parent().remove();
                    saveFriends();
                }.bind(this), 300);
            });

            newFriend.append(nameBox).append(': ').append(amountBox).append(editBtn).append(deleteBtn);  
            $('#friend-list').append(newFriend);

            $('#friend-name').val('');
            $('#amount').val('');
            saveFriends(); 
        }
    }

    function updateFriend() {
        var updatedName = $('#friend-name').val();
        var updatedAmount = parseFloat($('#amount').val());
        var updatedType = $('#transaction-type').val();

        var friendId = $('#add-friend-btn').data('friend-id');
        var friendItem = $('#friend-list li').eq(friendId);

        friendItem.find('.amount-box').text(updatedAmount + ' جنيه');

        if (updatedType === 'ديون') {
            friendItem.find('.amount-box').removeClass('due').addClass('debt');
        } else {
            friendItem.find('.amount-box').removeClass('debt').addClass('due');
        }

        friendItem.find('.friend-name').text(updatedName);

        $('#friend-name').val('');
        $('#amount').val('');
        $('#add-friend-btn').data('is-editing', false).removeData('friend-id');
        saveFriends();
    }

    function saveFriends() {
        var friends = [];
        $('#friend-list li').each(function() {
            var friend = {
                name: $(this).children('.friend-name').text(),
                amount: parseFloat($(this).find('.amount-box').text().split(' ')[0]),
                transactionType: $(this).find('.amount-box').hasClass('debt') ? 'ديون' : 'مستحقات'
            };
            friends.push(friend);
        });
        localStorage.setItem('friends', JSON.stringify(friends));
    }

    function loadFriends() {
        var friends = JSON.parse(localStorage.getItem('friends')) || [];
        if (friends.length > 0) {
            friends.forEach(function(friend) {
                var newFriend = $('<li class="friend"></li>');
                var nameBox = $('<span class="friend-name"></span>').text(friend.name);
                var amountBox = $('<div class="amount-box"></div>').text(friend.amount + ' جنيه');
                var editBtn = $('<button class="edit-btn"><i class="fas fa-edit"></i></button>');
                var deleteBtn = $('<button class="delete-btn"><i class="fas fa-trash"></i></button>');

                if (friend.transactionType === 'ديون') {
                    amountBox.addClass('debt');
                } else {
                    amountBox.addClass('due');
                }

                editBtn.click(function() {
                    $('#friend-name').val(friend.name);
                    $('#amount').val(friend.amount);
                    $('#transaction-type').val(friend.transactionType);
                    $('#add-friend-btn').data('is-editing', true).data('friend-id', $(this).parent().index());
                });

                deleteBtn.click(function() {
                    $(this).parent().addClass('fade-out');
                    setTimeout(function() {
                        $(this).parent().remove();
                        saveFriends();
                    }.bind(this), 300);
                });

                newFriend.append(nameBox).append(': ').append(amountBox).append(editBtn).append(deleteBtn); 
                $('#friend-list').append(newFriend);
            });
        }
    }
});
