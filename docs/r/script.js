const userId = 314714117; // Replace with your Roblox user ID

async function fetchUser Data() {
    try {
        // Fetch user info
        const userResponse = await fetch(`https://users.roblox.com/v1/users/${userId}`);
        const userData = await userResponse.json();

        // Display user info
        document.getElementById('username').innerText = userData.name;
        document.getElementById('userId').innerText = userData.id;
        document.getElementById('avatar').src = `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`;

        // Fetch friends list
        const friendsResponse = await fetch(`https://friends.roblox.com/v1/users/${userId}/friends`);
        const friendsData = await friendsResponse.json();

        // Display friends count
        document.getElementById('friendsCount').innerText = friendsData.data.length;

        // Display friends list
        const friendsList = document.getElementById('friendsList');
        friendsData.data.forEach(friend => {
            const listItem = document.createElement('li');
            listItem.innerText = friend.name;
            friendsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Call the function to fetch user data
fetchUser Data();
