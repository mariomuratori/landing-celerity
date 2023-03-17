<!-- Index-1 component -->
<script>
	import Navbar from '../../Components/Navbar.svelte';

    import HomeSection from '../Layout2/HomeSection.svelte';
	import AboutUs from '../../Components/AboutUs.svelte';
	import Services from '../../Components/Services.svelte';
	import Team from '../../Components/Team.svelte';
	import Pricing from '../../Components/Pricing.svelte';
	import Testimonial from '../../Components/Testimonial.svelte';
	import Blog from '../../Components/Blog.svelte';
	import Contact from '../../Components/Contact.svelte';
	import Footer from '../../Components/Footer.svelte';

	import data from '../../Data/data';

</script>

<!-- STRAT NAVBAR -->
<Navbar extraclass="" />
<!-- END NAVBAR -->
<HomeSection />
<AboutUs />
<Services serviceData={data.SERVICE_DATA} websiteData={data.WEBSITE_DESCRIPTION} />
<Pricing pricingData={data.PRICING_DATA} />
<Contact />
