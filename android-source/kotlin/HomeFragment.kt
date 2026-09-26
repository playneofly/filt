package com.filternet.app

import android.animation.ObjectAnimator
import android.animation.ValueAnimator
import android.os.Bundle
import android.os.CountDownTimer
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.LinearInterpolator
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.filternet.app.databinding.FragmentHomeBinding
import com.filternet.app.model.Server
import com.filternet.app.model.ServerRepository
import com.filternet.app.model.PingQuality
import com.google.android.material.snackbar.Snackbar

/**
 * HomeFragment
 * ─────────────
 * صفحه اصلی — بدون اسکرول، همه چیز در یک صفحه:
 *  • وضعیت اتصال
 *  • دکمه Power (اتصال/قطع)
 *  • دکمه «انتخاب بهترین سرور» با انیمیشن اسکن
 *  • کارت سرور فعلی
 *  • آمار سرعت (دانلود / آپلود / IP)
 *  • دکمه «سرور نداری؟ کلیک کن»
 */
class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    // ── حالت اتصال ──────────────────────────────────────────────────────
    private enum class ConnState { OFF, CONNECTING, ON }
    private var connState = ConnState.OFF

    // ── سرور انتخاب‌شده ─────────────────────────────────────────────────
    private var selectedServer: Server = ServerRepository.getBest()

    // ── تایمر جلسه ──────────────────────────────────────────────────────
    private var sessionTimer: CountDownTimer? = null
    private var sessionSeconds = 0L

    // ── انیمیشن‌ها ──────────────────────────────────────────────────────
    private var orbitAnimOuter: ObjectAnimator? = null
    private var orbitAnimInner: ObjectAnimator? = null
    private var speedUpdateTimer: CountDownTimer? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        updateServerCard(selectedServer)
        setupOrbitAnimations()
        setupClickListeners()
        updateUI(ConnState.OFF)
    }

    // ════════════════════════════════════════════════════════════════════
    // کلیک‌ها
    // ════════════════════════════════════════════════════════════════════
    private fun setupClickListeners() {

        // دکمه اتصال اصلی
        binding.btnConnect.setOnClickListener {
            when (connState) {
                ConnState.OFF        -> startConnecting()
                ConnState.CONNECTING -> { /* ignore */ }
                ConnState.ON         -> disconnect()
            }
        }

        // انتخاب بهترین سرور
        binding.btnAutoSelect.setOnClickListener {
            if (connState == ConnState.ON) disconnect()
            showScanDialog()
        }

        // رفتن به لیست سرورها
        binding.serverCard.setOnClickListener {
            findNavController().navigate(R.id.action_home_to_servers)
        }

        // دکمه اضافه کردن سرور
        binding.btnNoServer.setOnClickListener {
            findNavController().navigate(R.id.action_home_to_servers)
        }
    }

    // ════════════════════════════════════════════════════════════════════
    // منطق اتصال
    // ════════════════════════════════════════════════════════════════════
    private fun startConnecting() {
        updateUI(ConnState.CONNECTING)
        // شبیه‌سازی handshake 2 ثانیه‌ای
        binding.btnConnect.postDelayed({
            if (connState == ConnState.CONNECTING) {
                connected()
            }
        }, 2100)
    }

    private fun connected() {
        updateUI(ConnState.ON)
        sessionSeconds = 0
        startSessionTimer()
        startSpeedUpdates()
        showSnack("اتصال امن برقرار شد · ${selectedServer.country}")
    }

    private fun disconnect() {
        sessionTimer?.cancel()
        speedUpdateTimer?.cancel()
        updateUI(ConnState.OFF)
        resetSpeedCards()
        showSnack("اتصال قطع شد")
    }

    // ════════════════════════════════════════════════════════════════════
    // دیالوگ اسکن سرور
    // ════════════════════════════════════════════════════════════════════
    private fun showScanDialog() {
        val dialog = ScanningBottomSheet.newInstance { bestServer ->
            // بعد از اتمام اسکن، سرور بهینه انتخاب می‌شود
            selectedServer = bestServer
            updateServerCard(bestServer)
            showSnack("✨ بهترین سرور: ${bestServer.country} · پینگ ${bestServer.ping} ms")
        }
        dialog.show(parentFragmentManager, ScanningBottomSheet.TAG)
    }

    // ════════════════════════════════════════════════════════════════════
    // بروزرسانی UI بر اساس وضعیت
    // ════════════════════════════════════════════════════════════════════
    private fun updateUI(state: ConnState) {
        connState = state
        val ctx = requireContext()

        when (state) {
            ConnState.OFF -> {
                // pill
                binding.tvStatus.text = getString(R.string.status_disconnected)
                binding.tvStatus.setTextColor(ContextCompat.getColor(ctx, R.color.fn_sub))
                binding.statusDot.background = ContextCompat.getDrawable(ctx, R.drawable.bg_dot_grey)
                binding.statusPill.background = ContextCompat.getDrawable(ctx, R.drawable.bg_pill_disconnected)
                // متن
                binding.tvStatusText.text = getString(R.string.tap_to_connect)
                binding.tvTimer.text = getString(R.string.secure_motto)
                // دکمه power
                binding.icPower.setColorFilter(ContextCompat.getColor(ctx, R.color.fn_faint))
                binding.btnConnect.strokeWidth = 0
                binding.btnConnect.cardElevation = 16f
                // هاله
                binding.haloRing.visibility = View.INVISIBLE
                // orbit
                orbitAnimOuter?.resume()
                orbitAnimInner?.resume()
            }

            ConnState.CONNECTING -> {
                binding.tvStatus.text = getString(R.string.status_connecting)
                binding.tvStatus.setTextColor(ContextCompat.getColor(ctx, R.color.fn_accent))
                binding.statusDot.background = ContextCompat.getDrawable(ctx, R.drawable.bg_dot_accent)
                binding.statusPill.background = ContextCompat.getDrawable(ctx, R.drawable.bg_pill_connecting)
                binding.tvStatusText.text = getString(R.string.please_wait)
                binding.tvTimer.text = getString(R.string.handshake)
                binding.icPower.setColorFilter(ContextCompat.getColor(ctx, R.color.fn_accent))
                binding.haloRing.visibility = View.INVISIBLE
                // orbit سریع‌تر
                orbitAnimOuter?.setDuration(1100)
                orbitAnimOuter?.repeatCount = ValueAnimator.INFINITE
            }

            ConnState.ON -> {
                binding.tvStatus.text = getString(R.string.status_connected)
                binding.tvStatus.setTextColor(ContextCompat.getColor(ctx, R.color.fn_mint))
                binding.statusDot.background = ContextCompat.getDrawable(ctx, R.drawable.bg_dot_mint)
                binding.statusPill.background = ContextCompat.getDrawable(ctx, R.drawable.bg_pill_connected)
                binding.tvStatusText.text = getString(R.string.you_are_protected)
                binding.icPower.setColorFilter(ContextCompat.getColor(ctx, R.color.white))
                // button gradient
                binding.btnConnect.setCardBackgroundColor(ContextCompat.getColor(ctx, R.color.fn_accent))
                // هاله
                binding.haloRing.visibility = View.VISIBLE
                startHaloAnimation()
                // orbit کُند
                orbitAnimOuter?.setDuration(14000)
            }
        }
    }

    // ════════════════════════════════════════════════════════════════════
    // کارت سرور
    // ════════════════════════════════════════════════════════════════════
    fun updateServerCard(server: Server) {
        selectedServer = server
        binding.tvServerCode.text = server.code
        binding.tvServerName.text = "${server.country} — ${server.city}"
        binding.tvServerInfo.text = "پینگ ${server.ping} ms · بار سرور ${server.load}٪"

        // رنگ پینگ
        val q = PingQuality.from(server.ping)
        val pingColor = when (q) {
            PingQuality.GOOD -> R.color.fn_mint
            PingQuality.MID  -> R.color.fn_amber
            PingQuality.BAD  -> R.color.fn_rose
        }
        binding.tvServerInfo.setTextColor(ContextCompat.getColor(requireContext(), pingColor))
    }

    // ════════════════════════════════════════════════════════════════════
    // انیمیشن‌ها
    // ════════════════════════════════════════════════════════════════════
    private fun setupOrbitAnimations() {
        orbitAnimOuter = ObjectAnimator.ofFloat(
            binding.orbitRingOuter, View.ROTATION, 0f, 360f
        ).apply {
            duration = 14000
            repeatCount = ValueAnimator.INFINITE
            interpolator = LinearInterpolator()
            start()
        }

        orbitAnimInner = ObjectAnimator.ofFloat(
            binding.orbitRingInner, View.ROTATION, 360f, 0f
        ).apply {
            duration = 26000
            repeatCount = ValueAnimator.INFINITE
            interpolator = LinearInterpolator()
            start()
        }
    }

    private fun startHaloAnimation() {
        ObjectAnimator.ofFloat(binding.haloRing, View.SCALE_X, 0.92f, 1.28f).apply {
            duration = 2400
            repeatCount = ValueAnimator.INFINITE
            repeatMode = ValueAnimator.RESTART
            start()
        }
        ObjectAnimator.ofFloat(binding.haloRing, View.SCALE_Y, 0.92f, 1.28f).apply {
            duration = 2400
            repeatCount = ValueAnimator.INFINITE
            repeatMode = ValueAnimator.RESTART
            start()
        }
        ObjectAnimator.ofFloat(binding.haloRing, View.ALPHA, 0.55f, 0f).apply {
            duration = 2400
            repeatCount = ValueAnimator.INFINITE
            repeatMode = ValueAnimator.RESTART
            start()
        }
    }

    // ════════════════════════════════════════════════════════════════════
    // تایمر جلسه
    // ════════════════════════════════════════════════════════════════════
    private fun startSessionTimer() {
        sessionTimer?.cancel()
        sessionTimer = object : CountDownTimer(Long.MAX_VALUE, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                sessionSeconds++
                val h = sessionSeconds / 3600
                val m = (sessionSeconds % 3600) / 60
                val s = sessionSeconds % 60
                binding.tvTimer.text = "%02d:%02d:%02d".format(h, m, s)
            }
            override fun onFinish() {}
        }.start()
    }

    // ════════════════════════════════════════════════════════════════════
    // آمار سرعت (شبیه‌سازی)
    // ════════════════════════════════════════════════════════════════════
    private var currentDown = 42.0
    private var currentUp = 12.0

    private fun startSpeedUpdates() {
        speedUpdateTimer?.cancel()
        currentDown = 42.0
        currentUp = 12.0
        updateSpeedCards(currentDown, currentUp)

        speedUpdateTimer = object : CountDownTimer(Long.MAX_VALUE, 900) {
            override fun onTick(millisUntilFinished: Long) {
                currentDown = (currentDown + (Math.random() * 18 - 9)).coerceIn(18.0, 96.0)
                currentUp   = (currentUp   + (Math.random() * 8  - 4)).coerceIn(4.0,  26.0)
                updateSpeedCards(currentDown, currentUp)
            }
            override fun onFinish() {}
        }.start()
    }

    private fun updateSpeedCards(down: Double, up: Double) {
        // کارت دانلود
        binding.cardDownload.findViewById<android.widget.TextView>(R.id.tv_value)
            ?.text = "%.1f".format(down)
        // کارت آپلود
        binding.cardUpload.findViewById<android.widget.TextView>(R.id.tv_value)
            ?.text = "%.1f".format(up)
        // IP
        binding.cardIp.findViewById<android.widget.TextView>(R.id.tv_value)
            ?.text = "85.17.24"
    }

    private fun resetSpeedCards() {
        binding.cardDownload.findViewById<android.widget.TextView>(R.id.tv_value)?.text = "0.0"
        binding.cardUpload.findViewById<android.widget.TextView>(R.id.tv_value)?.text = "0.0"
        binding.cardIp.findViewById<android.widget.TextView>(R.id.tv_value)?.text = "—"
    }

    // ════════════════════════════════════════════════════════════════════
    // Snackbar
    // ════════════════════════════════════════════════════════════════════
    private fun showSnack(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        sessionTimer?.cancel()
        speedUpdateTimer?.cancel()
        orbitAnimOuter?.cancel()
        orbitAnimInner?.cancel()
        _binding = null
    }
}
