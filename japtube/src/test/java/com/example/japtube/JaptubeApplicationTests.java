package com.example.japtube;

import com.example.japtube.entity.*;
import com.example.japtube.repository.*;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest
class JaptubeApplicationTests {
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SubtitleRepository subtitleRepository;

    @Autowired
    private FilmRepository filmRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PackageRepository packageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private ShortsRepository shortsRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserPackageRepository userPackageRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void contextLoads() {
    }
    //Tạo role
    @Test
    void role_save(){
        Role user_normal = new Role(null, "USER_NORMAL");
        Role user_vip = new Role(null, "USER_VIP");
        Role admin = new Role(null, "ADMIN");
        roleRepository.saveAll(List.of(user_normal,user_vip,admin));
    }

    //Tạo category
    @Test
    void category_save(){
        Category romance = Category.builder().name("romance").build();
        Category action = Category.builder().name("action").build();
        Category shonen = Category.builder().name("shonen").build();
        Category comedy = Category.builder().name("comedy").build();
        Category sciefi = Category.builder().name("sciefi").build();
        Category boylove = Category.builder().name("boylove").build();
        Category shojou = Category.builder().name("shojou").build();
        categoryRepository.saveAll(List.of(romance, action, shonen, comedy, sciefi, boylove, shojou));
    }

    //Tạo film
    @Test
    void film_save() {
        Faker faker = new Faker();
        String[] levels = {"N1", "N2", "N3", "N4", "N5"};
        for (int i = 0; i < 6; i++) {
            Category c1 = categoryRepository.findById(i+1).orElse(null);
            Category c2 = categoryRepository.findById(i+2).orElse(null);
            List<Category> categories = new ArrayList<>(List.of(c1, c2));

            Film film = Film.builder()
                    .title(faker.book().title())
                    .description(faker.ancient().primordial())
                    .totalEpisode((int) Math.floor(Math.random()*20))
                    .categories(categories)
                    .status(true)
                    .publishedAt(LocalDateTime.now())
                    .level(levels[(int) Math.ceil(Math.random()*4)])
                    .likes(0)
                    .build();
            filmRepository.save(film);
        }
    }

    //Tạo video
    @Test
    void video_save() {
        Faker faker = new Faker();
        for (int i = 0; i < 3; i++) {
            Film film = filmRepository.findById(1).orElse(null);

            Video video = Video.builder()
                    .title(faker.book().title())
                    .episode(i+1)
                    .isFree(false)
                    .status(true)
                    .publishedAt(LocalDateTime.now())
                    .path("upload_videos/filmId_2/ep_" + i + "/video " + i + ".mp4")
                    .views(0)
                    .thumbnail(null)
                    .film(film)
                    .build();

            videoRepository.save(video);
        }
    }

    //Tạo subtitle
    @Test
    void  subtitle_save(){
        Video video1 = videoRepository.findById(1).orElse(null);
        Video video2 = videoRepository.findById(2).orElse(null);
        Video video3 = videoRepository.findById(3).orElse(null);

        Subtitle subtitle1 = new Subtitle(null, "subtitle 1", null,"vi",null, null, video1);
        Subtitle subtitle2 = new Subtitle(null, "subtitle 2", null,"jp",null, null, video1);
        Subtitle subtitle3 = new Subtitle(null, "subtitle 3", null,"vi",null, null, video2);
        Subtitle subtitle4 = new Subtitle(null, "subtitle 4", null,"jp",null, null, video2);
        Subtitle subtitle5 = new Subtitle(null, "subtitle 5", null,"vi",null, null, video3);
        subtitleRepository.saveAll(List.of(subtitle1, subtitle2, subtitle3, subtitle4, subtitle5));
    }

    //Tạo package
    @Test
    void package_save(){
        Packages package1 = new Packages(null, "Basic Package", "Premium package with variety of videos and films available", 99000d,"basic");
        Packages package2 = new Packages(null, "Premium Package", "Most Popular Package, Saving money", 150000d,"premium");

        packageRepository.saveAll(List.of(package1, package2));
    }

    //Tạo user
    @Test
    void user_save(){
        Role user_normal_role = roleRepository.findById(1).orElse(null);
        Role user_vip_role = roleRepository.findById(2).orElse(null);
        Role admin_role = roleRepository.findById(3).orElse(null);

        User normal = new User(null, "user_normal", "user_normal@gmail.com", passwordEncoder.encode("111"), null, false, LocalDateTime.now(), List.of(user_normal_role), new ArrayList<>(), new ArrayList<>());
        User vip = new User(null, "user_vip", "user_vip@gmail.com", passwordEncoder.encode("111"), null, true, LocalDateTime.now(), List.of(user_normal_role, user_vip_role), new ArrayList<>(), new ArrayList<>());
        User admin = new User(null, "admin", "admin@gmail.com", passwordEncoder.encode("111"), null, false, LocalDateTime.now(), List.of(admin_role), new ArrayList<>(), new ArrayList<>());
        userRepository.saveAll(List.of(normal, vip, admin));
    }

    //Tạo playlist
    @Test
    void playlist_save(){
        User user1 = userRepository.findById(1).orElse(null);

        for (int i = 0; i < 2; i++) {
            Playlist playlist = Playlist.builder()
                    .name("Playlist" + (i+1))
                    .user(user1).build();

            playlistRepository.save(playlist);
        }
    }

    //Tạo shorts
    @Test
    void shorts_save() {
        User user1 = userRepository.findById(1).orElse(null);
        Playlist playlist1 = playlistRepository.findById(1).orElse(null);
        Playlist playlist2 = playlistRepository.findById(2).orElse(null);
        List<Playlist> playlists = new ArrayList<>(List.of(playlist1, playlist2));

        for (int i = 0; i < 2; i++) {
            Shorts shorts = Shorts.builder()
                    .title("Playlist" + (i+1))
                    .description("Description" + (i+1))
                    .user(user1)
                    .build();

            shortsRepository.save(shorts);
        }
    }
    //Tạo comments
    @Test
    void comments_save() {

        for (int i = 0; i < 3; i++) {
            User user = userRepository.findById(i+1).orElse(null);
            Video video =videoRepository.findById(i+1).orElse(null);

            Comment comment = Comment.builder()
                    .content("comments of " + user.getUsername())
                    .user(user)
                    .video(video)
                    .build();

            commentRepository.save(comment);
        }
    }

    //Tạo order
    @Test
    void order_save() {
        for (int i = 0; i < 2; i++) {
            User user = userRepository.findById(i+1).orElse(null);
            Packages packages = packageRepository.findById(1).orElse(null);

            assert packages != null;
            Order order = Order.builder()
                    .status(0)
                    .packages(packages)
                    .price(packages.getPrice())
                    .user(user)
                    .build();
            orderRepository.save(order);
        }
    }

    //confirm order - admin role only
    @Test
    void confirm_order(){
        Order order = orderRepository.findById(3).orElse(null);

        assert order != null;
        //Tạo userPackage với expired matched with package type
        UserPackage userPackage = UserPackage.builder()
                .user(order.getUser())
                .packages(order.getPackages())
                .effectiveDate(LocalDateTime.now())
                .expiredAt(LocalDateTime.now().plusDays(183))
                .valid(true)
                .build();
        //add vip_user_role to user
        Role vip_role = roleRepository.findById(2).orElse(null);
        List<Role> roles = order.getUser().getRoles();
        roles.add(vip_role);

        //user vip active
        order.getUser().setVipActive(true);
        order.getUser().setRoles(roles);
        userRepository.save(order.getUser());

        //update order status -> success
        order.setStatus(1);
        orderRepository.save(order);

        userPackageRepository.save(userPackage);
    }

    //note
    @Test
    void note_save() {
        for (int i = 0; i < 2; i++) {
            User user = userRepository.findById(i+1).orElse(null);
            Shorts shorts = shortsRepository.findById(1).orElse(null);

            Note note = Note.builder()
                    .content("my note user " + (i+1))
                    .user(user)
                    .shorts(shorts)
                    .build();

            noteRepository.save(note);
        }
    }
    //User Package

    //LikedFilm

    //WatchedVideo
}
