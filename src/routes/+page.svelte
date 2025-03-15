<svelte:head>
	<title>Nick Armstrong</title>
</svelte:head>

<div id="header">
	<div id="name">
		<h1>Nick Armstrong</h1>
	</div>
	<div id="links">
		<a href="https://www.linkedin.com/in/nick-armstrong-eng/">
			<img class="logo" src="LinkedInLogo.png" alt="LinkedIn">
		</a>
		<a href="https://www.github.com/n-arms">
			<img class="logo" src="GitHubLogo.png" alt="GitHub">
		</a>
	</div>
</div>
<p>
	Waterloo Computer Engineering '29
</p>
<p>
	I'm a comp eng undergrad who is passionate about embedded software, microcontrollers, robotics, pcb design, compilers, robotic pathfinding and trajectory optimization.
</p>
<p>
	I'm currently working at Ford as a Manufacturing Software Engineer and seeking employment for an embedded software/hardware co-op starting in September 2025.
</p>
<p>
	My resume is <a target='_blank' href="Resume.pdf">here</a> and you can reach me at <a href="mailto:n2armstr@uwaterloo.ca">n2armstr@uwaterloo.ca</a>.
</p>

<style>
	.logo {
		max-height: 2rem;
		margin-left: 1rem;
		margin-right: 1rem;
	}
	#links {
		display: flex;
		flex-direction: row;
	}
	#header {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		justify-content: space-between;
	}
</style>
