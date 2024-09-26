    document.addEventListener('DOMContentLoaded', function() {
        startSnow();
    });

    function startSnow() {
        const canvas = document.getElementById('snowCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const snowflakes = [];
        const numFlakes = 200;

        class Snowflake {
            constructor(x, y, speed, size, opacity) {
                this.x = x;
                this.y = y;
                this.speed = speed;
                this.size = size;
                this.opacity = opacity;
                this.angle = Math.random() * 2 * Math.PI;
                this.spin = Math.random() * 0.02 - 0.01;
            }

            update() {
                this.y += this.speed;
                this.x += Math.sin(this.angle) * 0.5;
                this.angle += this.spin;

                if (this.y > canvas.height) {
                    this.y = -this.size;
                    this.x = Math.random() * canvas.width;
                    this.opacity = 1;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = `rgba(255, 0, 0, ${this.opacity})`; // Color red with opacity for snowflakes
                ctx.shadowBlur = 5;
                ctx.shadowColor = 'rgba(255, 0, 0, 0.8)'; // Glow effect color red
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            }
        }

        for (let i = 0; i < numFlakes; i++) {
            snowflakes.push(new Snowflake(
                Math.random() * canvas.width,
                Math.random() * -canvas.height, // Ensure snowflakes start above the top of the canvas
                Math.random() * 3 + 1,
                Math.random() * 2 + 1,
                1
            ));
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            snowflakes.forEach(flake => {
                flake.update();
                flake.draw();
            });
            requestAnimationFrame(draw);
        }

        draw();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
