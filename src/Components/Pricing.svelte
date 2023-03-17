<!-- pricing component -->
<script>
	import { Col, Row, Container } from 'sveltestrap';

	export let pricingData = {};
	const { title, description, pricing_list } = pricingData;
</script>

<!--START PRICING-->
<section class="section bg-light common-section" id="pricing">
	<Container>
		<Row>
			<Col lg={{ size: 8, offset: 2 }}>
				<h1 class="section-title text-center">{title}</h1>
				<div class="section-title-border mt-3" />
				<p class="section-subtitle font-secondary text-muted text-center pt-4">
					{description}
				</p>
			</Col>
		</Row>
		<Row class="mt-5">
			{#each pricing_list as list,key}
				<Col lg={4}>
					<div class={key === 1 ? 'text-center pricing-box bg-white price-active' : 'text-center pricing-box'} >
						{#if key === 1}
							<div class="ribbon-box"><span>Popular</span></div>
						{/if}
						<h4 class="text-uppercase">{list.title}</h4>
						<h1>{list.price}</h1>
						<h6 class="text-uppercase text-muted">Billing Per Month</h6>
						<div class="plan-features mt-5">
							<p>Bandwidth: <b class="text-primary">{list.bandwidth}</b></p>
							<p>Onlinespace: <b class="text-primary">{list.onlinespace}</b></p>
							<p>Support: <b class="text-primary">{list.support}</b></p>
							<p><b class="text-primary">{list.domain}</b> Domain</p>
							<p><b class="text-primary">{list.hiddenfees}</b> Hidden Fees</p>
						</div>
						<a href={'#'} class="btn btn-primary waves-effect waves-light mt-5">GET IN TOUCH</a>
					</div>
				</Col>
			{/each}
		</Row>
	</Container>
</section>
<!--ENd PRICING-->
