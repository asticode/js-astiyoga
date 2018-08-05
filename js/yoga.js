const exercises = [
    {
        label: "Butterfly",
        sides: false,
        video: "https://youtu.be/C41KDHpKW-w"
    },
    {
        label: "Cat Pulling Its Tail",
        sides: true,
        video: "https://youtu.be/hEyCFVVvXls"
    },
    {
        label: "Dangling",
        sides: false,
        video: "https://youtu.be/d5LLFxkm2fQ"
    },
    {
        label: "Deer",
        sides: true,
        video: "https://youtu.be/AAob8VDW_q4"
    },
    {
        label: "Dragons",
        sides: true,
        video: "https://youtu.be/03fzjfayk2w"
    },
    {
        label: "Frog",
        sides: false,
        video: "https://youtu.be/TKDdMTmS08g"
    },
    {
        label: "Happy Baby",
        sides: false,
        video: "https://youtu.be/tZQVsSETrZI"
    },
    {
        label: "Melting Heart",
        sides: false,
        video: "https://youtu.be/VM87l97X7gY"
    },
    {
        label: "Reclining Twists",
        sides: true,
        video: "https://youtu.be/ZvyPOey0JWs"
    },
    {
        label: "Sphinx",
        sides: false,
        video: "https://youtu.be/ZJG0nWhkwWg"
    },
    {
        label: "Square",
        sides: false,
        video: "https://youtu.be/1h_gUwyLjDQ"
    },
    {
        label: "Straddle",
        sides: false,
        video: "https://youtu.be/5tV7bLb4qbs"
    },
    {
        label: "Swan",
        sides: true,
        video: "https://youtu.be/0CqyL7371eE"
    },
    {
        label: "Toe Squat",
        sides: false,
        video: "https://youtu.be/tzb7hxFCqDY"
    }
];
const yoga = {
    circles: [],
    exercises: [],
    history: [],
    init: function() {
        for (let idx = 0; idx < 4; idx++) {
            yoga.circles.push(null);
            yoga.exercises.push(null);
            yoga.history.push([]);
        }

        yoga.storage.load();

        yoga.initAudio();

        yoga.drawExercises();

        yoga.drawHistory();
    },
    storage: {
        load: function() {
            let i = localStorage.getItem("exercises");
            if (i) yoga.exercises = JSON.parse(i);
            i = localStorage.getItem("history");
            if (i) yoga.history = JSON.parse(i);
        },
        save: function() {
            localStorage.setItem("exercises", JSON.stringify(yoga.exercises));
            localStorage.setItem("history", JSON.stringify(yoga.history));
        }
    },
    initAudio: function() {
        yoga.a = new Audio("music/song.mp3");
        yoga.a.addEventListener("ended", function() {
            document.getElementById("fa-play").className = "fa fa-play";

            const idx = yoga.currentExerciseIndex();
            if (idx > -1) {
                yoga.updateExerciseProgress(idx, 1);
                yoga.addHistory(idx);
                yoga.drawHistory();
            }

            yoga.handlePlay(false);
        });
        yoga.a.addEventListener("playing", function() {
            document.getElementById("fa-play").className = "fa fa-pause";
        });
        yoga.a.addEventListener("pause", function() {
            document.getElementById("fa-play").className = "fa fa-play";
        });
        yoga.a.addEventListener("timeupdate", function() {
            if (yoga.a.currentTime !== yoga.a.duration) yoga.updateCurrentExerciseProgress(yoga.a.currentTime / yoga.a.duration);
        });
        yoga.a.addEventListener("durationchange", function() {
            const idx = yoga.currentExerciseIndex();
            if (idx > -1) yoga.a.currentTime = yoga.a.duration * yoga.exercises[yoga.currentExerciseIndex()].progress;
        });
    },
    drawExercises: function() {
        for (let idx = 0; idx < 4; idx++) {
            yoga.drawExercise(idx);
        }
    },
    drawExercise: function(idx) {
        // Get exercise
        const e = yoga.exercises[idx];

        // Create circle
        const c = new ProgressBar.Circle(document.getElementsByClassName("exercise")[idx], {
            strokeWidth: 10,
            easing: 'easeInOut',
            duration: 20,
            color: '#5cb85c',
            trailColor: '#eee',
            trailWidth: 10,
            text: {
                alignToBottom: false,
                value: yoga.drawExerciseSelect(e, idx)
            },
            svgStyle: null
        });
        if (e) c.animate(e.progress);

        // Store circle
        yoga.circles[idx] = c;
    },
    drawExerciseSelect: function(e, idxExercise) {
        let s = `<select onchange='yoga.handleChange(` + idxExercise + `)'>
        <option value="" disabled selected>Select an exercise</option>`;
        for (let idx = 0; idx < exercises.length; idx++) {
            s += "<option " + (e ? (e.label === exercises[idx].label ? "selected" : "") : "") + ">" + exercises[idx].label +"</option>"
        }
        return s + "</select>";
    },
    handleChange: function(idx) {
        // Get exercise
        const si = document.getElementsByClassName("exercise")[idx].querySelector("select").selectedIndex;
        let e = exercises[si-1];
        e.progress = 0;
        let es = [{
            e: e,
            idx: idx,
        }];

        // Exercise has sides
        if (e.sides) {
            const sideIdx = (idx >= 3 ? idx - 1 : idx + 1);
            document.getElementsByClassName("exercise")[sideIdx].querySelector("select").selectedIndex = si;
            es.push({
                e: Object.assign({}, e),
                idx: sideIdx,
            });
        }

        // Update exercise
        for (let idx = 0; idx < es.length; idx++) {
            yoga.exercises[es[idx].idx] = es[idx].e;
        }
        yoga.storage.save();
    },
    drawHistory: function() {
        for (let idxExercise = 0; idxExercise < yoga.history.length; idxExercise++) {
            document.getElementsByClassName("history")[idxExercise].innerHTML = "";
            for (let idxItem = yoga.history[idxExercise].length - 1; idxItem >= 0; idxItem--) {
                yoga.drawHistoryItem(idxExercise, yoga.history[idxExercise][idxItem])
            }
        }
    },
    drawHistoryItem: function(idxExercise, e) {
        document.getElementsByClassName("history")[idxExercise].innerHTML += "<div>" + e.label + "</div>"
    },
    currentExerciseIndex: function() {
        for (let idx = 0; idx < yoga.exercises.length; idx++) {
            if (yoga.exercises[idx] && yoga.exercises[idx].progress < 1) {
                return idx;
            }
        }
        return -1;
    },
    updateCurrentExerciseProgress: function(progress) {
        const idx = yoga.currentExerciseIndex();
        if (idx > -1) yoga.updateExerciseProgress(idx, progress);
    },
    updateExerciseProgress: function(idx, progress) {
        if (!yoga.exercises[idx]) return;
        yoga.exercises[idx].progress = progress;
        yoga.circles[idx].animate(progress);
        yoga.storage.save();
    },
    handlePlay: function(clicked) {
        // All exercises are done
        if (yoga.currentExerciseIndex() === -1) {
            if (clicked && yoga.exercises[0]) {
                yoga.handleRetry();
            } else {
                return;
            }
        }

        // Handle
        if (yoga.a.paused) {
            yoga.a.play();
        } else {
            yoga.a.pause();
        }
    },
    handleRetry: function() {
        yoga.a.pause();
        yoga.a.currentTime = 0;
        for (let idx = 0; idx < yoga.exercises.length; idx++) {
            yoga.updateExerciseProgress(idx, 0);
        }
    },
    addHistory: function(idx) {
        if (idx === 0) {
            for (let a = 0; a < 4; a++) {
                if (yoga.history[a].length >= 6) yoga.history[a].shift();
                yoga.history[a].push({
                    label: "&nbsp"
                })
            }
        }
        yoga.history[idx][yoga.history[idx].length - 1] = yoga.exercises[idx];
        yoga.storage.save();
    }
};