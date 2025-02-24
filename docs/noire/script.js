const userId = "1323434210123452480"
const subtextElement = document.getElementById("subtext")
const statusDot = document.getElementById("status-dot")

async function fetchPresence() {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`)
    const data = await response.json()

    if (data.success && data.data) {
      const presence = data.data

      const discordStatus = presence.discord_status
      switch (discordStatus) {
        case "online":
          statusDot.style.color = "#22C55E"
          break
        case "idle":
          statusDot.style.color = "#FACC15"
          break
        case "dnd":
          statusDot.style.color = "#EF4444"
          break
        default:
          statusDot.style.color = "#6B7280"
      }

      const customStatus = presence.activities.find((activity) => activity.type === 4)
      if (customStatus && customStatus.state) {
        let statusText = customStatus.state

        if (customStatus.emoji) {
          if (customStatus.emoji.id) {
            const emojiExtension = customStatus.emoji.animated ? "gif" : "png"
            const emojiURL = `https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${emojiExtension}`
            statusText =
              `<img src="${emojiURL}" alt="${customStatus.emoji.name}" style="width: 20px; vertical-align: middle; margin-right: 5px;">` +
              statusText
          } else if (customStatus.emoji.name) {
            statusText = `${customStatus.emoji.name} ${statusText}`
          }
        }
        subtextElement.innerHTML = statusText
      }
    } else {
      subtextElement.textContent = "Unable to fetch status"
    }
  } catch (error) {
    subtextElement.textContent = "Error fetching status"
    console.error("Error fetching presence data:", error)
  }
}

function updateTime() {
  const now = new Date()
  const options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }
  const timeString = now.toLocaleTimeString("en-GB", options)
  document.getElementById("time").textContent = timeString
}

function startApp() {
  document.getElementById("splash-screen").style.display = "none"
  document.getElementById("content").style.display = "block"
  playNextSong(audioFiles)
}

const audioFiles = ["https://r2.interrupted.me/F/mvB8AP12.mp3"]

function playNextSong(files) {
  if (files.length === 0) return
  const nextSong = new Audio(files.shift())
  nextSong.play().catch((error) => {
    console.error("Error playing audio:", error)
  })
  nextSong.onended = () => {
    playNextSong(files)
  }
}

function createNoise() {
  const canvas = document.createElement("canvas")
  canvas.classList.add("noise")
  const ctx = canvas.getContext("2d")

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resize()
  window.addEventListener("resize", resize)

  function noise() {
    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255
      data[i] = value
      data[i + 1] = value
      data[i + 2] = value
      data[i + 3] = 255
    }

    ctx.putImageData(imageData, 0, 0)
  }

  setInterval(noise, 50)
  document.body.appendChild(canvas)
}

function startSnow() {
  const canvas = document.getElementById("snowCanvas")
  const ctx = canvas.getContext("2d")
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const snowflakes = []
  const numFlakes = 200

  class Snowflake {
    constructor(x, y, speed, size, opacity) {
      this.x = x
      this.y = y
      this.speed = speed
      this.size = size
      this.opacity = opacity
      this.angle = Math.random() * 2 * Math.PI
      this.spin = Math.random() * 0.02 - 0.01
    }

    update() {
      this.y += this.speed
      this.x += Math.sin(this.angle) * 0.5
      this.angle += this.spin

      if (this.y > canvas.height) {
        this.y = -this.size
        this.x = Math.random() * canvas.width
        this.opacity = 1
      }
    }

    draw() {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(this.angle)
      ctx.fillStyle = `rgba(73, 85, 122, ${this.opacity})`
      ctx.shadowBlur = 5
      ctx.shadowColor = "#49557a"
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
      ctx.restore()
    }
  }

  for (let i = 0; i < numFlakes; i++) {
    snowflakes.push(
      new Snowflake(
        Math.random() * canvas.width,
        Math.random() * -canvas.height,
        Math.random() * 3 + 1,
        Math.random() * 2 + 1,
        1,
      ),
    )
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    snowflakes.forEach((flake) => {
      flake.update()
      flake.draw()
    })
    requestAnimationFrame(draw)
  }

  draw()

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}

document.addEventListener("DOMContentLoaded", () => {
  createNoise()
  startSnow()
  updateTime()
  fetchPresence()
  setInterval(updateTime, 1000)
  setInterval(fetchPresence, 1000)
})

document.getElementById("loading-box").addEventListener("DOMContentLoaded", () => {
  document.getElementById("loading-box-icon-spin").src = "/res/img/loading-box-icon-finish.png"
  document.getElementById("loading-box-text").innerHTML = "Loaded."
  document.getElementById("loading-box").className = "finished"

  setTimeout(() => {
    document.getElementById("loading-box-icon-spin").src = "/res/img/loading-box-icon-spin.png"
    document.getElementById("loading-box-text").innerHTML = "Loading..."
  }, 500)
})

window.onbeforeunload = () => {
  document.getElementById("loading-box-icon-spin").src = "/res/img/loading-box-icon-spin.png"
  document.getElementById("loading-box-text").innerHTML = "Loading..."
  document.getElementById("loading-box").classList.remove("finished")
}

