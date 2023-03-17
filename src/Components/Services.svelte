<!-- services component -->
<script>
	import { Col, Row, Container } from 'sveltestrap';

	export let serviceData = {};
	export let websiteData = {};
	const { heading, description, services_list } = serviceData;
	const { title, buttontext, text } = websiteData;

</script>

<!--START SERVICES-->
<section class="section bg-light common-section" id="services">
	<Container>
		<Row>
			<Col lg={{ size: 8, offset: 2 }}>
				<h1 class="section-title text-center">{heading}</h1>
				<div class="section-title-border mt-3" />
				<p class="section-subtitle text-muted text-center pt-4 font-secondary">
					{description}
				</p>
			</Col>
		</Row>
		<Row class="mt-5">
			{#each services_list as list}
				<Col lg={4} class="mt-4">
					<div class="services-box">
						<div class="d-flex">
							<i class="{list.icon} text-primary" />
							<div class="ms-4">
								<h4>{list.label}</h4>
								<p class="pt-2 text-muted">
									{list.text}
								</p>
							</div>
						</div>
					</div>
				</Col>
			{/each}
		</Row>
	</Container>
</section>
<!--START SERVICES-->

 <!--START WEBSITE-DESCRIPTION-->
<section class="section bg-web-desc">
    <div class="bg-overlay"></div>
    <Container>
        <Row>
            <Col lg={12} class="text-center">
                <h2 class="text-white">{title}</h2>
                <p class="pt-3 home-desc mx-auto">{text}</p>
                <a href={"#"} class="btn btn-white mt-5 waves-effect waves-light">{buttontext}</a>
            </Col>
        </Row>
    </Container>
</section>
<!--END WEBSITE-DESCRIPTION-->