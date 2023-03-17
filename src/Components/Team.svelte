<!-- Team component -->
<script>
  import { Col, Row, Container } from "sveltestrap";

  export let teamData = {};
  const { title, description, team_list } = teamData;
</script>

<!--START TEAM-->
<section class="section common-section" id="about">
  <Container>
    <Row>
      <Col lg={{ size: 8, offset: 2 }}>
        <div class="about-title mx-auto text-center">
          <h2>{title}</h2>
          <p class="text-muted pt-4">
            {description}
          </p>
        </div>
      </Col>
    </Row>
    <Row class="mt-5">
      {#each team_list as list}
        <Col lg="3" sm="6">
          <div class="team-box text-center">
            <div class="team-wrapper">
              <div class="team-member">
                <img alt="" src={list.profile} class="img-fluid rounded" />
              </div>
            </div>
            <h4 class="team-name">{list.name}</h4>
            <p class="text-uppercase team-designation">{list.designation}</p>
          </div>
        </Col>
      {/each}
    </Row>
  </Container>
</section>
<!--END TEAM-->