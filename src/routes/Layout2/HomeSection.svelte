<script>
	import { Modal, ModalBody, ModalHeader , Container, Row ,Col} from 'sveltestrap';
    
    let open = false;
	/**
	 * Toggle modal
	 */
	const toggle = () => {
		open = !open;
	};
	// import wave1 from '../../../public/images/wave-shape/wave1.png'
	// import wave2 from '../../../public/images/wave-shape/wave2.png'
	// import wave3 from '../../../public/images/wave-shape/wave3.png'
</script>

<!--START HOME-->

<section class="section bg-home home-half common-section" id="home" data-image-src="images/bg-home.jpg">
	<div class="bg-overlay"></div>
	<Container>
		<Row class="justify-content-center">
			<Col lg={8} class="text-white text-center">
				<h4 class="home-small-title">RYONAN</h4>
				<h1 class="home-title">Website optimization service</h1>
				<p class="pt-3 home-desc mx-auto">We boost your site pagespeed scores and help you increase your conversion rates and SEO rankings</p>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<a href={"#"} class="btn btn-primary mt-5 waves-effect waves-light">SHOPIFY <i class="mdi mdi-rotate-90 mdi-rocket" /></a>
				<a href={"#"} class="btn btn-primary mt-5 waves-effect waves-light">WORDPRESS <i class="mdi mdi-rotate-90 mdi-rocket" /></a>
			</Col>
		</Row>
	</Container>

	<div class="wave-effect wave-anim">
		<div class="waves-shape shape-one">
			<div class="wave wave-one" style="background-image: url('images/wave-shape/wave1.png'})"></div>
		</div>
		<div class="waves-shape shape-two">
			<div class="wave wave-two" style="background-image: url('images/wave-shape/wave2.png'})"></div>
		</div>
		<div class="waves-shape shape-three">
			<div class="wave wave-three" style="background-image: url('images/wave-shape/wave3.png'})"></div>
		</div>
	</div>
</section>

<!--END HOME-->