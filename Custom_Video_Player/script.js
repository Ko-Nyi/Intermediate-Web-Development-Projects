var container,mainVideo,videoTimeline,progressBar,volumeBtn,volumeSlider,currentVidTime,videoDuration,skipBackward,skipForward,playPauseBtn,speedBtn,speedOptions,pipBtn,fullScreenBtn;

let timer;

//DOM is ready
window.onload=function init(){
    console.log('dom is ready')
    //get element
    container = document.querySelector(".container");
    container.addEventListener("mousemove", () => {
        container.classList.add("show-controls");
        clearTimeout(timer);
        hideControls();   
    });

    mainVideo = container.querySelector("video");
    mainVideo.addEventListener("timeupdate", e => {
        let {currentTime, duration} = e.target;
        let percent = (currentTime / duration) * 100;
        progressBar.style.width = `${percent}%`;
        currentVidTime.innerText = formatTime(currentTime);
    });
    
    mainVideo.addEventListener("loadeddata", () => {
        videoDuration.innerText = formatTime(mainVideo.duration);
    });

    mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"));

    mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"));


    videoTimeline = container.querySelector(".video-timeline");
    videoTimeline.addEventListener("mousemove", e => {
        let timelineWidth = videoTimeline.clientWidth;
        let offsetX = e.offsetX;
        let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
        const progressTime = videoTimeline.querySelector("span");
        offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
        progressTime.style.left = `${offsetX}px`;
        progressTime.innerText = formatTime(percent);
    });

    videoTimeline.addEventListener("click", e => {
        let timelineWidth = videoTimeline.clientWidth;
        mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    });

    videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar));

    progressBar = container.querySelector(".progress-bar");
    
    volumeBtn = container.querySelector(".volume i");
    volumeBtn.addEventListener("click", () => {
        if(!volumeBtn.classList.contains("fa-volume-high")) {
            mainVideo.volume = 0.5;
            volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
        } else {
            mainVideo.volume = 0.0;
            volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
        }
        volumeSlider.value = mainVideo.volume;
    });

    volumeSlider = container.querySelector(".left input");
    volumeSlider.addEventListener("input", e => {
        mainVideo.volume = e.target.value;
        if(e.target.value == 0) {
            return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
        }
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    });

    currentVidTime = container.querySelector(".current-time");
    videoDuration = container.querySelector(".video-duration");

    skipBackward = container.querySelector(".skip-backward i");
    skipBackward.addEventListener("click", () => mainVideo.currentTime -= 5);

    skipForward = container.querySelector(".skip-forward i");
    skipForward.addEventListener("click", () => mainVideo.currentTime += 5);

    playPauseBtn = container.querySelector(".play-pause i");
    playPauseBtn.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause());

    speedBtn = container.querySelector(".playback-speed span");
    speedBtn.addEventListener("click", () => speedOptions.classList.toggle("show"));

    speedOptions = container.querySelector(".speed-options");
    speedOptions.querySelectorAll("li").forEach(option => {
        option.addEventListener("click", () => {
            mainVideo.playbackRate = option.dataset.speed;
            speedOptions.querySelector(".active").classList.remove("active");
            option.classList.add("active");
        });
    });

    pipBtn = container.querySelector(".pic-in-pic span");
    pipBtn.addEventListener("click", () => mainVideo.requestPictureInPicture());

    fullScreenBtn = container.querySelector(".fullscreen i");
    fullScreenBtn.addEventListener("click", () => {
        container.classList.toggle("fullscreen");
        if(document.fullscreenElement) {
            fullScreenBtn.classList.replace("fa-compress", "fa-expand");
            return document.exitFullscreen();
        }
        fullScreenBtn.classList.replace("fa-expand", "fa-compress");
        container.requestFullscreen();
    });

const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();
}

const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

document.addEventListener("click", e => {
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
        speedOptions.classList.remove("show");
    }
});

document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar));