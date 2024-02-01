let searchUser = document.querySelector('.search-bar');

searchUser.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userName = document.getElementById('search-name').value;
    if (userName === '') {
        alert('Enter the GitHub username!');
        return;
    }
    try {
        const userData = await getUser(userName);
        updateDom(userData);
    } catch (error) {
        alert('Error occurred while fetching the data.');
    }
});

const userApi = "https://api.github.com/users/";

const getUser = async function user(username) {
    const response = await fetch(userApi + username);
    const data = await response.json();
    if (data.message === "Not Found") {
        alert("Enter the correct username !");
        return null;
    }
    return data;
}

const updateDom = (data) => {
    const profile_photo = document.querySelector('.profile-photo');
    const twitter_user = 'https://twitter.com/' + data.twitter_username;
    profile_photo.innerHTML = `<img src="${data.avatar_url}" />`;
    document.querySelector('.about h2').innerHTML = data.name;
    document.querySelector('.bio').innerHTML = data.bio;
    document.querySelector('.location').innerHTML = '<img src="assets/pin.png">' + data.location;
    document.querySelector('.twitter').innerHTML = 'Twitter:-' + `<a href="${twitter_user}">${twitter_user}</a>`;
    document.querySelector('.profile-link').innerHTML = '<img src="assets/link.png">' + `<a href="${data.html_url}">${data.html_url}</a>`;

    // Assuming you have a container element with the class 'project-box'

    const projectBox = document.querySelector('.project-box');
    addProjectName(data.repos_url, projectBox);
    projectBox.innerHTML = '';
}

const addProjectName = async (reposUrl, projectBox) => {
    try {
        showLoader();
        const response = await fetch(reposUrl);
        const reposData = await response.json();

        // Check if data is an array
        if (!Array.isArray(reposData)) {
            console.error('Invalid data format. Expected an array or iterable.');
            return;
        }

        for (const repo of reposData) {
            const repoResponse = await fetch(repo.languages_url);
            const repoData = await repoResponse.json();

            const repoName = repo.name;
            const repoDescription = repo.description || 'Description not available!';
            const repoTechnologies = Object.keys(repoData);

            let box1 = `<div class="project project1">
                <h1>${repoName}</h1>
                <p>${repoDescription}</p>
                <div class="technology">
                    <ul>${repoTechnologies.map(tech => `<li class="color-box">${tech}</li>`).join('')}</ul>
                </div>
            </div>`;
            projectBox.innerHTML += box1;
        }
    } catch (error) {
        console.error('Error fetching repositories:', error);
    } finally {
        hideLoader();
    }
}

const showLoader = () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'block';
    }
};

const hideLoader = () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
};
