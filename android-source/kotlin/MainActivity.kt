package com.filternet.app

import android.os.Bundle
import android.text.SpannableString
import android.text.Spanned
import android.text.style.ForegroundColorSpan
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.content.ContextCompat
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.filternet.app.databinding.ActivityMainBinding

/**
 * MainActivity
 * ─────────────
 * ورودی اصلی اپ. مدیریت:
 * - هدر (لوگو + نام FILTERNET + دکمه تم)
 * - BottomNavigationView → NavController
 * - تغییر تم روشن/تیره
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var navController: NavController
    private var isDark = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupNavigation()
        setupAppName()
        setupThemeButton()
    }

    // ── ناوبری ──────────────────────────────────────────────────────────
    private fun setupNavigation() {
        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController
        binding.bottomNav.setupWithNavController(navController)
    }

    // ── نام FILTERNET با دو رنگ ─────────────────────────────────────────
    private fun setupAppName() {
        val full = "FILTERNET"
        val span = SpannableString(full)
        // "FILTER" → رنگ اصلی تیره
        span.setSpan(
            ForegroundColorSpan(ContextCompat.getColor(this, R.color.fn_ink)),
            0, 6,
            Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
        )
        // "NET" → رنگ accent (آبی)
        span.setSpan(
            ForegroundColorSpan(ContextCompat.getColor(this, R.color.fn_accent)),
            6, 9,
            Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
        )
        binding.tvAppName.text = span
    }

    // ── تغییر تم ────────────────────────────────────────────────────────
    private fun setupThemeButton() {
        binding.btnThemeToggle.setOnClickListener {
            isDark = !isDark
            if (isDark) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
                binding.btnThemeToggle.setImageResource(R.drawable.ic_sun)
            } else {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
                binding.btnThemeToggle.setImageResource(R.drawable.ic_moon)
            }
        }
    }
}
