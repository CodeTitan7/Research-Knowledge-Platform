import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import ScienceIcon from "@mui/icons-material/Science";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import DescriptionIcon from "@mui/icons-material/Description";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

import {
  dashboardStats,
  recentCompounds,
} from "../data/mockData";

function Dashboard() {
  const statCards = [
    {
      title: "Compounds",
      value: dashboardStats.compounds,
      icon: <ScienceIcon />,
    },
    {
      title: "Targets",
      value: dashboardStats.targets,
      icon: <TrackChangesIcon />,
    },
    {
      title: "Documents",
      value: dashboardStats.documents,
      icon: <DescriptionIcon />,
    },
    {
      title: "Queries",
      value: dashboardStats.queries,
      icon: <QuestionAnswerIcon />,
    },
  ];

  return (
    <Box>
      {/* Page heading */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        Dashboard
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Welcome back, Researcher. Explore compounds
        and research evidence.
      </Typography>

      {/* Statistics */}
      <Grid
        container
        spacing={3}
        sx={{ mb: 4 }}
      >
        {statCards.map((stat) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={stat.title}
          >
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {stat.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{ mt: 1 }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      color: "primary.main",
                      display: "flex",
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent compounds */}
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
          >
            Recent Compounds
          </Typography>

          {recentCompounds.map((compound) => (
            <Box
              key={compound.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 2,
                borderBottom: "1px solid #eee",
              }}
            >
              <Box>
                <Typography fontWeight="bold">
                  {compound.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {compound.identifier}
                </Typography>
              </Box>

              <Typography variant="body2">
                {compound.target}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {compound.category}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;