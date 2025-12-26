<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;
use App\Models\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $applications = Application::where('user_id', Auth::id())
            ->orderBy('status')
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Dashboard', [
            'applications' => $applications,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreApplicationRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = Auth::id();

        Application::create($validated);

        return Redirect::back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateApplicationRequest $request, Application $application): RedirectResponse
    {
        if ($application->user_id !== Auth::id()) {
            abort(403);
        }

        $application->update($request->validated());

        return Redirect::back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Application $application): RedirectResponse
    {
        if ($application->user_id !== Auth::id()) {
            abort(403);
        }

        $application->delete();

        return Redirect::back();
    }

    /**
     * Update the status of the specified resource.
     */
    public function updateStatus(Request $request, Application $application): JsonResponse
    {
        if ($application->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'status' => ['required', 'string', 'max:50'],
        ]);

        $application->update([
            'status' => $request->input('status'),
        ]);

        return response()->json(['success' => true]);
    }
}

