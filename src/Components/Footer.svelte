<!-- Footer Component -->
<script>
	import { Col, Row, Container } from 'sveltestrap';
</script>

<!--START FOOTER-->
<footer class="footer">
	<Container>
		<Row>
			<Col lg="3" class="mt-4">
				<h4>HIRIC</h4>
				<div class="text-muted mt-4">
					<ul class="list-unstyled footer-list">
						<li><a href={'#'}>Home</a></li>
						<li><a href={'#'}>About us</a></li>
						<li><a href={'#'}>Careers</a></li>
						<li><a href={'#'}>Contact us</a></li>
					</ul>
				</div>
			</Col>
			<Col lg="3" class="mt-4">
				<h4>Information</h4>
				<div class="text-muted mt-4">
					<ul class="list-unstyled footer-list">
						<li><a href={'#'}>Terms & Condition</a></li>
						<li><a href={'#'}>About us</a></li>
						<li><a href={'#'}>Jobs</a></li>
						<li><a href={'#'}>Bookmarks</a></li>
					</ul>
				</div>
			</Col>
			<Col lg="3" class="mt-4">
				<h4>Support</h4>
				<div class="text-muted mt-4">
					<ul class="list-unstyled footer-list">
						<li><a href={'#'}>FAQ</a></li>
						<li><a href={'#'}>Contact</a></li>
						<li><a href={'#'}>Disscusion</a></li>
					</ul>
				</div>
			</Col>
			<Col lg="3" class="mt-4">
				<h4>Subscribe</h4>
				<div class="text-muted mt-4">
					<p>
						In an ideal world this text wouldn’t exist, a client would acknowledge the importance of having
						web copy before the design starts.
					</p>
				</div>
				<form class="form subscribe">
					<input placeholder="Email" class="form-control" required />
					<a href={'#'} class="submit"><i class="pe-7s-paper-plane" /></a>
				</form>
			</Col>
		</Row>
	</Container>
</footer>
<!--END FOOTER-->

<!--START FOOTER ALTER-->
<div class="footer-alt">
	<Container>
		<Row>
			<Col lg="12">
				<div class="float-start pull-none ">
					<p class="copy-rights text-muted mb-3 mb-sm-0">
						{new Date().getFullYear()}
						© Hiric - Themesbrand
					</p>
				</div>
				<div class="float-end pull-none ">
					<ul class="list-inline d-flex flex-wrap social m-0">
						<li class="list-inline-item">
							<a href={"#"} class="social-icon"><i class="mdi mdi-facebook" /></a>
						</li>
						<li class="list-inline-item">
							<a href={"#"} class="social-icon"><i class="mdi mdi-twitter" /></a>
						</li>
						<li class="list-inline-item">
							<a href={"#"} class="social-icon"><i class="mdi mdi-linkedin" /></a>
						</li>
						<li class="list-inline-item">
							<a href={"#"} class="social-icon"><i class="mdi mdi-google-plus" /></a>
						</li>
						<li class="list-inline-item">
							<a href={"#"} class="social-icon"><i class="mdi mdi-microsoft-xbox" /></a>
						</li>
					</ul>
				</div>
				<div class="clearfix" />
			</Col>
		</Row>
	</Container>
</div>
<!--START FOOTER ALTER-->
