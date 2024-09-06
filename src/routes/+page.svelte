<svelte:head>
	<title>Nick Armstrong</title>
	<link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro' rel='stylesheet' type='text/css'>
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
	I'm a comp eng undergrad who is passionate about compilers, robotics pathfinding and trajectory optimization, GPU programming, and embedded development.
</p>
<p>
	I'm currently seeking employment for two different 4 month co-op jobs, one starting January 2025, and the next starting September 2025.
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
	h1, p {
		font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
	}
</style>